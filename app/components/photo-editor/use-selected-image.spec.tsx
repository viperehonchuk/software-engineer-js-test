import { act, renderHook } from '@testing-library/react';

import readImageAsElement from '../../utils/read-image-as-element';

import useSelectedImage from './use-selected-image';

const readImageAsElementMock = readImageAsElement as jest.MockedFunction<
  typeof readImageAsElement
>;
jest.mock('../../utils/read-image-as-element', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      const img = new Image();
      img.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' +
        'AAAFCAYAAACNbyblAAAAHElEQVQI12P4' +
        '//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
      return Promise.resolve(img);
    }),
  };
});

describe('useSelectedImage', () => {
  it('should handle no file selected', () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useSelectedImage(onSelect));
    const changeEvent = {
      target: {
        files: [],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    result.current.onSelect(changeEvent);
    expect(onSelect).not.toHaveBeenCalled();
  });
  it('should ignore invalid file types', async () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useSelectedImage(onSelect));
    const file = new File(['(⌐□_□)'], 'document.pdf', {
      type: 'application/pdf',
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(() => result.current.onSelect(changeEvent));
    expect(onSelect).not.toHaveBeenCalled();
  });
  it('should handle PNG file selection', async () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useSelectedImage(onSelect));
    const file = new File(['(⌐□_□)'], 'testfile.png', {
      type: 'image/png',
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    await act(() => result.current.onSelect(changeEvent));
    expect(readImageAsElementMock).toHaveBeenCalledWith(file);
    expect(onSelect).toHaveBeenCalledWith(expect.any(HTMLImageElement));
  });

  it('should handle JPEG file selection', async () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useSelectedImage(onSelect));
    const file = new File(['(⌐□_□)'], 'testfile.jpg', {
      type: 'image/jpeg',
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    await act(() => result.current.onSelect(changeEvent));
    expect(onSelect).toHaveBeenCalledWith(expect.any(HTMLImageElement));
  });

  it('should handle GIF file selection', async () => {
    const onSelect = jest.fn();
    const { result } = renderHook(() => useSelectedImage(onSelect));
    const file = new File(['(⌐□_□)'], 'testfile.gif', {
      type: 'image/gif',
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await act(() => result.current.onSelect(changeEvent));
    expect(readImageAsElementMock).toHaveBeenCalledWith(file);
    expect(onSelect).toHaveBeenCalledWith(expect.any(HTMLImageElement));
  });
});
