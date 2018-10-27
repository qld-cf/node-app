module.exports = {
    apps: [{
        name: "xne-express",
        script: "./app.js",
        watch: true,
        instance_var: 'INSTANCE_ID',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 8080,
            "NODE_ENV": 'production',
        }
    }]
}