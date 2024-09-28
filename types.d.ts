// 環境変数の型定義
declare namespace NodeJS {
    export interface ProcessEnv {
        RPC_URL: string;
        PAYMASTER_RPC_URL: string;
        PRIVATE_KEY: string;
        MY_TO_ADDRESS: string;
    }
}
