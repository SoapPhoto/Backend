declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
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

    COOKIE_DOMAIN: string;

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

    /**
     * 应用的名称
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    TITLE: string;
    /**
     * log文件夹
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    LOGGER_DIR: string;
    /**
     * log文件
     *
     * @type {string}
     * @memberof ProcessEnv
     */
    LOGGER_FILE: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_DB: string;
    REDIS_PASSWORD: string;
    REDIS_PRIFIX: string;

    OAUTH_GITHUB_CLIENT_ID: string;
    OAUTH_GITHUB_CLIENT_SECRET: string;

    OAUTH_GOOGLE_CLIENT_ID: string;
    OAUTH_GOOGLE_CLIENT_SECRET: string;

    OAUTH_WEIBO_CLIENT_ID: string;
    OAUTH_WEIBO_CLIENT_SECRET: string;
  }
}
