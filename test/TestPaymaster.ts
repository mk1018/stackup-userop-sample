import { ethers } from "ethers";
import { sendUserOp } from "../scripts/Paymaster";
import { SEPOLIA_ADDRESSES } from "../utils/addresses";

const privateKey = process.env.PRIVATE_KEY;

describe("sendUserOp function", () => {
  it("should execute without errors", async () => {
    const mockSigner = new ethers.Wallet(privateKey);
    const mockContract = new ethers.Contract(
      SEPOLIA_ADDRESSES.ERC20_6TEST,
      [
        "function transfer(address to, uint amount)"
      ],
      mockSigner
    );

    await sendUserOp(mockSigner, mockContract);
  });
});
