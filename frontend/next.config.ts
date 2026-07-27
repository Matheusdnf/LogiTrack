import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantém a regra de varredura (polling) para o ambiente WSL funcionar
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  // Adiciona a configuração vazia para o Turbopack aceitar o build
  turbopack: {},
};

export default nextConfig;
