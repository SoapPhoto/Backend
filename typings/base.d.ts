
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * 端口
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    PORT: string;
    /**
     * url
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    URL: string;
    
    DATABASE_PORT: string;
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    
    QN_BUCKET: string;
    QN_ACCESS_KEY: string;
    QN_SECRET_KEY: string;
    
    /**
     * cdn地址
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    CDN_URL: string;
    
    /**
     * token
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    BASIC_TOKEN: string;
    
    EMAIL_HOST: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    
    /**
     * 默认列表数量
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    LIST_PAGE_SIZE: string;
  }
}
