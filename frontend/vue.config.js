const { defineConfig } = require('@vue/cli-service')

module.exports= {
  devServer: {
    client: {
      webSocketURL: "auto://0.0.0.0:0/ws"
    }
  }
}

module.exports = defineConfig({
  transpileDependencies: true
}) 

