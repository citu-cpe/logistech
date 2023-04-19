import { join } from 'path';
import { unlink } from 'fs';

export const deleteFile = (filePath: string) => {
  filePath = join(filePath);
  unlink(filePath, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      // tslint:disable-next-line
      console.error('clearImageError:', err);
    }
  });
};
