import { Connection, createConnection, getConnectionOptions } from 'typeorm';

const closeConnectioni = new Connection({ type: 'postgres' });

export const openConnection = async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? 'backjobs_test'
          : defaultOptions.database,
    }),
  );
};

export const disconnect = (): Promise<void> => closeConnectioni.close();
