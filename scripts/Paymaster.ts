import { ethers, Signer, Contract } from "ethers";
import { Presets, Client } from "userop";
import dotenv from "dotenv";

dotenv.config();
const rpcUrl = process.env.RPC_URL || "";
const paymasterRpcUrl = process.env.PAYMASTER_RPC_URL || "";
const toAddress = process.env.MY_TO_ADDRESS || "";

export async function sendUserOp(signer: Signer, gasErc20Contract: Contract) {
  const gasErc20TokenAddress = gasErc20Contract.address
  const sendErc20TokenAddress = gasErc20Contract.address

  // Initialize the paymaster
  const paymasterContext = {
  	"type": "erc20token",
  	"token": gasErc20TokenAddress // 6TEST
  };
  
  const paymaster = Presets.Middleware.verifyingPaymaster(
    paymasterRpcUrl,
    paymasterContext
  );
  
  // Initialize userop builder
  var builder = await Presets.Builder.Kernel.init(
    signer,
    rpcUrl,
    {
      paymasterMiddleware: paymaster
    }
  );
  const address = builder.getSender();
  console.log(`Account address: ${address}`);

  const calls = [
    {
      to: sendErc20TokenAddress,
      value: ethers.constants.Zero,
      data: gasErc20Contract.interface.encodeFunctionData('transfer', [toAddress, 1000000])
    },
  ];

  // Build & send
  const client = await Client.init(rpcUrl);
  const res = await client.sendUserOperation(builder.executeBatch(calls), {
    onBuild: (op) => console.log("Signed UserOperation:", op),
  });

  console.log(`UserOpHash: ${res.userOpHash}`);
  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}
