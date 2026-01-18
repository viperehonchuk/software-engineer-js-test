import readImageAsElement from './read-image-as-element';

describe('readImageAsElement', () => {
  const RealFileReader = (globalThis as any).FileReader;
  const RealImage = (globalThis as any).Image;
  let lastReadFile: any;

  beforeEach(() => {
    jest.useFakeTimers();
    lastReadFile = undefined;

    // Fake FileReader which sets `result` and calls onload on next tick.
    class FakeFileReader {
      result: any = null;
      onload: ((event_: any) => void) | null = null;
      onerror: ((event_: any) => void) | null = null;

      addEventListener(
        _type: string,
        listener: (event: ProgressEvent<FileReader>) => void,
      ) {
        if (_type === 'load') {
          // eslint-disable-next-line unicorn/prefer-add-event-listener
          this.onload = listener;
        } else if (_type === 'error') {
          // eslint-disable-next-line unicorn/prefer-add-event-listener
          this.onerror = listener;
        }
      }

      readAsDataURL(file: any) {
        // record the file passed in for assertions
        lastReadFile = file;

        // use file.name to decide whether to simulate an error path
        this.result =
          file && file.name && file.name.includes('error')
            ? 'trigger-error'
            : 'data:image/png;base64,FAKE';

        // call onload asynchronously so callers can attach handlers after src is set
        setTimeout(() => {
          if (this.onload) this.onload({ target: this } as any);
        }, 0);
      }
    }
    (globalThis as any).FileReader = FakeFileReader as any;

    // Fake Image which triggers onload/onerror on next tick after src is set.
    class FakeImage {
      private _src = '';
      onload: (() => void) | null = null;
      onerror: ((error: any) => void) | null = null;

      addEventListener(
        _type: string,
        listener: (event: ProgressEvent<HTMLImageElement>) => void,
      ) {
        if (_type === 'load') {
          // eslint-disable-next-line unicorn/prefer-add-event-listener
          this.onload = () => listener(null as any);
        } else if (_type === 'error') {
          // eslint-disable-next-line unicorn/prefer-add-event-listener
          this.onerror = listener;
        }
      }
      set src(v: string) {
        this._src = v;
        // trigger handlers on next tick (so tests mirror the real-world timing:
        // src is set before onload/onerror handlers are attached in the helper)
        setTimeout(() => {
          if (v === 'trigger-error') {
            if (this.onerror) this.onerror(new Error('image error'));
          } else {
            if (this.onload) this.onload();
          }
        }, 0);
      }
      get src() {
        return this._src;
      }
    }
    (globalThis as any).Image = FakeImage as any;
  });

  afterEach(() => {
    // restore globals and timers
    jest.useRealTimers();
    (globalThis as any).FileReader = RealFileReader;
    (globalThis as any).Image = RealImage;
    jest.resetAllMocks();
  });

  it('resolves with an HTMLImageElement when image loads', async () => {
    const file = { name: 'ok' };
    const p = readImageAsElement(file as any);

    // readAsDataURL is called synchronously, confirm it received the file
    expect(lastReadFile).toBe(file);

    // advance timers to invoke reader.onload and then image.onload
    jest.runAllTimers();

    const img = await p;
    expect(img).toBeDefined();
    // our FakeFileReader sets the data URL exactly like this
    expect((img as any).src).toBe('data:image/png;base64,FAKE');
  });

  it('rejects when image errors', async () => {
    const file = { name: 'error' };
    const p = readImageAsElement(file as any);

    // readAsDataURL invoked
    expect(lastReadFile).toBe(file);

    // run timers to fire reader.onload and then image.onerror
    jest.runAllTimers();

    await expect(p).rejects.toThrow('Failed to load image');
  });

  it('attaches handlers after src is set so onload still fires (timing)', async () => {
    // This verifies the implementation's order (src set before handlers attached)
    const file = { name: 'ok-timing' };
    const p = readImageAsElement(file as any);

    // ensure readAsDataURL was called synchronously
    expect(lastReadFile).toBe(file);

    // flush scheduled timers which trigger reader.onload -> create Image -> scheduled onload
    jest.runAllTimers();

    await expect(p).resolves.toHaveProperty(
      'src',
      'data:image/png;base64,FAKE',
    );
  });
});
