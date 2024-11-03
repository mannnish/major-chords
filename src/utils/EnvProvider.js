class EnvProvider {
    static VERSION = process.env.REACT_APP_VERSION;
    static BACKEND_BASE = process.env.REACT_APP_BACKEND_URI;
}

export default EnvProvider;