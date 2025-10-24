import { createConfig, factory } from "ponder";
import { http, fallback } from "viem";
import { FactoryABI } from "./abis/factory.abi";
import { OrganizationABI } from "./abis/organization.abi";

export default createConfig({
  // database: {
  //   kind: "postgres",
  //   connectionString: process.env.PONDER_DATABASE_URL,
  // },
  networks: {
    baseSepolia: {
      chainId: 84532,
      transport: fallback([
        http(process.env.PONDER_RPC_URL_1, {
          retryCount: 2,
          retryDelay: 1000,
        }),
        http(process.env.PONDER_RPC_URL_2, {
          retryCount: 2,
          retryDelay: 1000,
        }),
      ]),
      maxRequestsPerSecond: 3,
      pollingInterval: 2000,
    },
  },
  contracts: {
    Factory: {
      network: "baseSepolia",
      abi: FactoryABI,
      address: "0x862E06f0211a99f3d80cF69c750b58388D240604",
      startBlock: 32775557,
    },
    Organization: {
      network: "baseSepolia",
      abi: OrganizationABI,
      address: factory({
        address: "0x862E06f0211a99f3d80cF69c750b58388D240604",
        event: FactoryABI.find(
          item => item.type === "event" && item.name === "OrganizationCreated"
        )!,
        parameter: "organization",
      }),
      startBlock: 32775557,
    },
  },
});