import { NetworkUserConfig } from "hardhat/types";
import { requireEnv } from "../utils/requireEnv";

// Chain IDs
export const chainIds = {
  hardhat: 31337,
  sepolia: 11155111,
  "optimism-mainnet": 10,
  "celo-mainnet": 42220,
  "base-sepolia": 84532,
  "base-mainnet": 8453,
  "arb-sepolia": 421614,
  arbitrumOne: 42161,
  filecoinCalibration: 314159,
  "filecoin-mainnet": 314,
};

interface EtherscanConfig {
  apiKey: string;
  apiURL?: string;
  browserURL?: string;
}

interface CustomChainConfig {
  network: string;
  chainId: number;
  urls: {
    apiURL: string;
    browserURL: string;
  };
}

interface ChainStrategy {
  getConfig(): NetworkUserConfig;
  getEtherscanConfig?(): EtherscanConfig;
  getCustomChainConfig?(): CustomChainConfig;
}

class DefaultChainStrategy implements ChainStrategy {
  constructor(private chain: keyof typeof chainIds, private mnemonic: string) {}

  getConfig(): NetworkUserConfig {
    return {
      accounts: {
        count: 10,
        mnemonic: this.mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[this.chain],
      url: `https://${this.chain}.infura.io/v3/${requireEnv(process.env.INFURA_API_KEY, "INFURA_API_KEY")}`,
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: requireEnv(process.env.ETHERSCAN_API_KEY, "ETHERSCAN_API_KEY"),
    };
  }

  getCustomChainConfig(): CustomChainConfig {
    return {
      network: this.chain,
      chainId: chainIds[this.chain],
      urls: {
        apiURL: "",
        browserURL: "",
      },
    };
  }
}

export class OptimismStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: `https://opt-mainnet.g.alchemy.com/v2/${requireEnv(process.env.ALCHEMY_API_KEY, "ALCHEMY_API_KEY")}`,
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: requireEnv(process.env.OPTIMISTIC_ETHERSCAN_API_KEY, "OPTIMISTIC_ETHERSCAN_API_KEY"),
    };
  }
}

export class BaseSepoliaStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: "https://sepolia.base.org",
      gasPrice: 1000000000,
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: requireEnv(process.env.BASESCAN_API_KEY, "BASESCAN_API_KEY"),
      apiURL: "https://api-sepolia.basescan.org/api",
      browserURL: "https://sepolia.basescan.org",
    };
  }

  getCustomChainConfig(): CustomChainConfig {
    return {
      network: "base-sepolia",
      chainId: chainIds["base-sepolia"],
      urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia.basescan.org",
      },
    };
  }
}

export class BaseMainnetStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: `https://base-mainnet.g.alchemy.com/v2/${requireEnv(process.env.ALCHEMY_API_KEY, "ALCHEMY_API_KEY")}`,
      gasPrice: 1000000000,
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: requireEnv(process.env.BASESCAN_API_KEY, "BASESCAN_API_KEY"),
    };
  }
}

export class ArbSepoliaStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: `https://arb-sepolia.g.alchemy.com/v2/${requireEnv(process.env.ALCHEMY_API_KEY, "ALCHEMY_API_KEY")}`,
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: requireEnv(process.env.ARBISCAN_API_KEY, "ARBISCAN_API_KEY"),
      apiURL: "https://api-sepolia.arbiscan.io/api",
      browserURL: "https://sepolia.arbiscan.io/",
    };
  }

  getCustomChainConfig(): CustomChainConfig {
    return {
      network: "arb-sepolia",
      chainId: chainIds["arb-sepolia"],
      urls: {
        apiURL: "https://api-sepolia.arbiscan.io/api",
        browserURL: "https://sepolia.arbiscan.io/",
      },
    };
  }
}

export class ArbitrumStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: `https://arb-mainnet.g.alchemy.com/v2/${requireEnv(process.env.ALCHEMY_API_KEY, "ALCHEMY_API_KEY")}`,
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: "DPB1JAY49URG4RJP76WQ11CMGPBF2FX3C5",
    };
  }
}

export class CeloStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      accounts: {
        count: 10,
        mnemonic: requireEnv(process.env.MNEMONIC_CELO, "MNEMONIC_CELO"),
        path: "m/44'/52752'/0'/0",
      },
    };
  }

  getEtherscanConfig(): EtherscanConfig {
    return {
      apiKey: requireEnv(process.env.CELOSCAN_API_KEY, "CELOSCAN_API_KEY"),
      apiURL: "https://api.celoscan.io/api",
      browserURL: "https://celoscan.io/",
    };
  }

  getCustomChainConfig(): CustomChainConfig {
    return {
      network: "celo-mainnet",
      chainId: chainIds["celo-mainnet"],
      urls: {
        apiURL: "https://api.celoscan.io/api",
        browserURL: "https://celoscan.io/",
      },
    };
  }
}

export class FilecoinCalibrationStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: "https://filecoin-calibration.chainup.net/rpc/v1",
    };
  }
}

export class FilecoinMainnetStrategy extends DefaultChainStrategy {
  getConfig(): NetworkUserConfig {
    return {
      ...super.getConfig(),
      url: "https://filecoin.chainup.net/rpc/v1",
    };
  }
}

// Factory
export function getChainStrategy(chain: keyof typeof chainIds, mnemonic: string): ChainStrategy {
  switch (chain) {
    case "optimism-mainnet":
      return new OptimismStrategy(chain, mnemonic);
    case "base-sepolia":
      return new BaseSepoliaStrategy(chain, mnemonic);
    case "base-mainnet":
      return new BaseMainnetStrategy(chain, mnemonic);
    case "arb-sepolia":
      return new ArbSepoliaStrategy(chain, mnemonic);
    case "arbitrumOne":
      return new ArbitrumStrategy(chain, mnemonic);
    case "celo-mainnet":
      return new CeloStrategy(chain, mnemonic);
    case "filecoinCalibration":
      return new FilecoinCalibrationStrategy(chain, mnemonic);
    case "filecoin-mainnet":
      return new FilecoinMainnetStrategy(chain, mnemonic);
    default:
      return new DefaultChainStrategy(chain, mnemonic);
  }
}

// Helper function to get all etherscan configs
export function getEtherscanConfigs(): Record<string, EtherscanConfig> {
  const configs: Record<string, EtherscanConfig> = {};
  Object.keys(chainIds).forEach((chain) => {
    const strategy = getChainStrategy(chain as keyof typeof chainIds, "dummy");
    if (strategy.getEtherscanConfig) {
      configs[chain] = strategy.getEtherscanConfig();
    }
  });
  return configs;
}

// Add helper function to get custom chains
export function getCustomChains(): CustomChainConfig[] {
  const customChains: CustomChainConfig[] = [];
  Object.keys(chainIds).forEach((chain) => {
    const strategy = getChainStrategy(chain as keyof typeof chainIds, "dummy");
    if (strategy.getCustomChainConfig) {
      customChains.push(strategy.getCustomChainConfig());
    }
  });
  return customChains;
}
