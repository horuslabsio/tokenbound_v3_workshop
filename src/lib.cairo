use starknet::ContractAddress;

#[starknet::interface]
trait ICustomAccount<TContractState> {
    fn on_erc721_received(
        self: @TContractState,
        operator: ContractAddress,
        from: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    ) -> felt252;
    fn my_custom_function(self: @TContractState) -> felt252;
}

#[starknet::contract]
pub mod TokenBoundAccount {
    use starknet::{ ContractAddress, get_caller_address, get_tx_info };

    use openzeppelin_introspection::src5::SRC5Component;
    use token_bound_accounts::components::account::account::AccountComponent;
    use token_bound_accounts::components::upgradeable::upgradeable::UpgradeableComponent;
    use token_bound_accounts::components::lockable::lockable::LockableComponent;
    use token_bound_accounts::components::signatory::signatory::SignatoryComponent;
    use token_bound_accounts::components::permissionable::permissionable::PermissionableComponent;
    use token_bound_accounts::interfaces::{
        IUpgradeable::IUpgradeable, IExecutable::IExecutable, ILockable::ILockable,
        ISignatory::ISignatory, IPermissionable::IPermissionable, IAccountV3::IAccountV3
    };

    component!(path: AccountComponent, storage: account, event: AccountEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: LockableComponent, storage: lockable, event: LockableEvent);
    component!(path: SignatoryComponent, storage: signatory, event: SignatoryEvent);
    component!(path: PermissionableComponent, storage: permissionable, event: PermissionableEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl AccountImpl = AccountComponent::AccountImpl<ContractState>;

    impl AccountInternalImpl = AccountComponent::AccountPrivateImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::UpgradeablePrivateImpl<ContractState>;
    impl LockableInternalImpl = LockableComponent::LockablePrivateImpl<ContractState>;
    impl SignerInternalImpl = SignatoryComponent::SignatoryPrivateImpl<ContractState>;
    impl PermissionableInternalImpl = PermissionableComponent::PermissionablePrivateImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        account: AccountComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        lockable: LockableComponent::Storage,
        #[substorage(v0)]
        signatory: SignatoryComponent::Storage,
        #[substorage(v0)]
        permissionable: PermissionableComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AccountEvent: AccountComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        LockableEvent: LockableComponent::Event,
        #[flat]
        SignatoryEvent: SignatoryComponent::Event,
        #[flat]
        PermissionableEvent: PermissionableComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        token_contract: ContractAddress,
        token_id: u256,
        registry: ContractAddress,
        implementation_hash: felt252,
        salt: felt252
    ) {
        self.account.initializer(token_contract, token_id, registry, implementation_hash, salt);
    }
    
}