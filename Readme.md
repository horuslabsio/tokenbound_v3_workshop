# Tokenbound v3 Workshop I

In this workshop, you'll learn how to build your own custom tokenbound account implementation.

Tokenbound Accounts allow NFTs to own assets and interact with applications, without requiring changes to existing smart contracts or infrastructure.

## Repo overview
- `factory.cairo` is a simple contract that showcases how you can deploy tokenbound accounts from within your Cairo smart contracts using an already existing Registry and Account implementation hash.

- `custom_account.cairo` showcases how to build your own custom account implementation from scratch utilizing the available plug'n'play components that comes with Tokenbound v3.
