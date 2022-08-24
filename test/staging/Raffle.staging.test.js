/**
 * To do our staging test, we need to do several things:
 * 1. Get our subId for chainlink vrf
 * 2. Deploy our contract using the subId
 * 3. Register the contract with chainlink vrf and its subId
 * 4. Register the conract with chailink keepers
 * 5. Run staging test
 */
const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit tests", async function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with a live Chainlink keepers and Chainlink vrf, we get a random winner", async () => {
                  // enter the raffle
                  const startingTimestamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()

                  //set up the listener before we enter the raffle just incase the blockchain moves fast
                  await new Promise(async (resolve, reject) => {
                      // setting up the listener
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!!!")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimestamp = await raffle.getLastTimeStamp()

                              // add our asserts here
                              await expect(raffle.getPlayer(0)).to.be.reverted // Making sure the raffle is reset once a winner is picked
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0) // Making sure the raffle resets to OPEN state
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimestamp > startingTimestamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })

                      // Then enter the raffle
                      console.log("Entering the raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      await tx.wait(2)
                      console.log("Raffle entered!")
                      const winnerStartingBalance = await accounts[0].getBalance()
                  })
              })
          })
      })
