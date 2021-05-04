import { IHashNameFilesProvider } from '@shared/providers/HashNameFilesProvider/protocol/IHashNameFilesProvider';

import { UploadFilesUseCase } from './UploadFilesUseCase';

interface ISutTypes {
  sut: UploadFilesUseCase;
  hashNameFileStub: IHashNameFilesProvider;
}

const makeHashNameFile = (): IHashNameFilesProvider => {
  class HashNameFilesStub implements IHashNameFilesProvider {
    hash(salt: number): string {
      return 'hashedName';
    }
  }

  return new HashNameFilesStub();
};

const makeSut = (): ISutTypes => {
  const hashNameFileStub = makeHashNameFile();
  const sut = new UploadFilesUseCase();

  return {
    sut,
    hashNameFileStub,
  };
};

describe('Upload Files', () => {
  it('Should return the file name after upload', async () => {
    const { sut, hashNameFileStub } = makeSut();

    // jest.spyOn(hashNameFileStub, 'hash');
    const hashedName = hashNameFileStub.hash(10);

    const fileName = 'fileName';
    const uploadStub = await sut.execute(fileName);

    expect(uploadStub).toEqual(`${hashedName}-${fileName}`);
  });
});
