use starknet::ContractAddress;

#[starknet::interface]
trait IFactory<TContractState> {
    fn create_account(
        ref self: TContractState,
        nft_contract_address: ContractAddress,
        nft_token_id: u256,
        salt: felt252,
        chain_id: felt252
    ) -> ContractAddress;
}

#[starknet::contract]
mod TBAFactory {
    use starknet::ContractAddress;
    use token_bound_accounts::interfaces::IRegistry::{IRegistryDispatcherTrait, IRegistryLibraryDispatcher};
    use super::IFactory;

    #[storage]
    struct Storage { }

    const REGISTRY_CLASS_HASH: felt252 = 0x7bf0cad6d569f43780ab5d3a50aa874050ac45192f471e3c88f2ce9ae0b3d75;
    const IMPLEMENTATION_HASH: felt252 = 0x29d2a1b11dd97289e18042502f11356133a2201dd19e716813fb01fbee9e9a4;

    #[abi(embed_v0)]
    impl FactoryImpl of IFactory<ContractState> {
        fn create_account(
            ref self: ContractState,
            nft_contract_address: ContractAddress,
            nft_token_id: u256,
            salt: felt252,
            chain_id: felt252
        ) -> ContractAddress {
            let account_address = IRegistryLibraryDispatcher {
                class_hash: REGISTRY_CLASS_HASH.try_into().unwrap()
            }
                .create_account(IMPLEMENTATION_HASH, nft_contract_address, nft_token_id, salt, chain_id);
            return account_address;
        }
    }
}