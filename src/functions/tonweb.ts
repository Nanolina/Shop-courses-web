import TonWeb from 'tonweb';

const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';
export const tonweb = new TonWeb(
  new TonWeb.HttpProvider(
    isProduction
      ? 'https://toncenter.com/api/v2/jsonRPC'
      : 'https://testnet.toncenter.com/api/v2/jsonRPC'
  )
);
