import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-viem";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";

import "@primitivefi/hardhat-dodoc";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import "hardhat-abi-exporter";
import "hardhat-preprocessor";
import { resolve } from "path";

import "./tasks";
import { chainIds, getChainStrategy, getEtherscanConfigs, getCustomChains } from "./config/ChainConfig";
import { requireEnv } from "./utils/requireEnv";
function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.trim().split("="));
}

const dotenvConfigPath: string = process.env.DOTENV_PATH ?? fs.existsSync("./.env") ? "./.env" : "./.env.example";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const MNEMONIC = requireEnv(process.env.MNEMONIC, "MNEMONIC");
const MNEMONIC_CELO = requireEnv(process.env.MNEMONIC_CELO, "MNEMONIC_CELO");

const config: HardhatUserConfig = {
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    only: [
      "CurrencyManager",
      "ExecutionManager",
      "HypercertMinter",
      "LooksRareProtocol",
      "OrderValidatorV2A",
      "StrategyManager",
      "TransferManager",
      "StrategyHypercertCollectionOffer",
      "StrategyHypercertDutchAuction",
      "StrategyHypercertFractionOffer",
      "CreatorFeeManagerWithRoyalties",
      "RoyaltyFeeRegistry",
      "ImmutableCreate2Factory",
    ],
    except: ["@openzeppelin"],
  },
  dodoc: {
    runOnCompile: false,
    include: ["src/marketplace", "src/protocol"],
    freshOutput: true,
    outputDir: "../docs/docs/developer/api/contracts",
  },
  etherscan: {
    apiKey: getEtherscanConfigs(),
    customChains: getCustomChains(),
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      accounts: {
        count: 10,
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds.hardhat,
    },
    localhost: {
      accounts: {
        count: 10,
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
    },
    "celo-mainnet": getChainStrategy("celo-mainnet", MNEMONIC_CELO).getConfig(),
    sepolia: getChainStrategy("sepolia", MNEMONIC).getConfig(),
    "optimism-mainnet": getChainStrategy("optimism-mainnet", MNEMONIC).getConfig(),
    "base-sepolia": getChainStrategy("base-sepolia", MNEMONIC).getConfig(),
    "base-mainnet": getChainStrategy("base-mainnet", MNEMONIC).getConfig(),
    "arb-sepolia": getChainStrategy("arb-sepolia", MNEMONIC).getConfig(),
    arbitrumOne: getChainStrategy("arbitrumOne", MNEMONIC).getConfig(),
    filecoinCalibration: getChainStrategy("filecoinCalibration", MNEMONIC).getConfig(),
    "filecoin-mainnet": getChainStrategy("filecoin-mainnet", MNEMONIC).getConfig(),
  },
  paths: {
    cache: "./cache_hardhat", // Use a different cache for Hardhat than Foundry
    sources: "./src",
    tests: "./test",
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          for (const [from, to] of getRemappings()) {
            if (line.includes(from)) {
              line = line.replace(from, to);
              break;
            }
          }
        }
        return line;
      },
    }),
  },
  solidity: {
    version: "0.8.17",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 5_000,
      },
    },
  },
  typechain: {
    outDir: "./types",
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
