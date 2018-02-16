const ethWallet = require("eth-lightwallet");
const Promise = require("bluebird");
const writeFile = Promise.promisify(require("fs").writeFile);

const upgradeOldEncryptedKeyStore = () => {
  const oldEncryptedWallet = JSON.stringify(require(process.env.OLD));
  return new Promise((resolve, reject) => {
    ethWallet.upgrade.upgradeOldSerialized(
      oldEncryptedWallet,
      process.env.PASSWORD,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(result));
      }
    );
  });
};

(async () => {
  let upgradedKeyStore = await upgradeOldEncryptedKeyStore();
  await writeFile(
    process.env.NEW,
    JSON.stringify(upgradedKeyStore, null, 2),
    {}
  );
  console.log("Upgrade complete, here is a taco: 🌮");
})();
