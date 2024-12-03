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
        ISignatory::ISignatory, IPermissionable::IPermissionable
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
    
    #[abi(embed_v0)]
    impl CustomAccount of super::ICustomAccount<ContractState>{
        fn on_erc721_received(
            self: @ContractState,
            operator: ContractAddress,
            from: ContractAddress,
            token_id: u256,
            data: Span<felt252>
        ) -> felt252 {
            let (_token_contract, _token_id, _chain_id) = self.account.token();
            let tx_info = get_tx_info().unbox();

            if (get_caller_address() == _token_contract
                && token_id == _token_id 
                && tx_info.chain_id == _chain_id) {
                panic(array!['Account: ownership cycle!']);
            }

            return 0x3a0dff5f70d80458ad14ae37bb182a728e3c8cdda0402a5daa86620bdf910bc;
        }

        fn my_custom_function(self: @ContractState) -> felt252 {
            2 + 2
        }
    }

    #[abi(embed_v0)]
    impl Signatory of ISignatory<ContractState>{
        fn is_valid_signer(self: @ContractState, signer: ContractAddress) -> bool {
            self.signatory._base_signer_validation(signer)
        }

        fn is_valid_signature(self: @ContractState, hash: felt252, signature: Span<felt252>) -> felt252 {
            self.signatory._is_valid_signature(hash, signature)
        }
    }

    #[abi(embed_v0)]
    impl Executable of IExecutable<ContractState>{
        fn execute(ref self: ContractState, mut calls: Array<Call>) -> Array<Span<felt252>> {
            let caller = get_caller_address();
            assert(self._is_valid_signer(caller), 'invalid signer!');

            let (is_locked, _) = self.lockable._is_locked();
            assert(is_locked != true, 'account is locked');
            self.account._execute(calls)
        }
    }

    #[abi(embed_v0)]
    impl Lockable of ILockable<ContractState>{
        fn lock(ref self: ContractState, lock_until: u64) {
            let caller = get_caller_address();
            let valid_signer = self._is_valid_signer(caller);
            assert(valid_signer, 'invalid signer!');

            self.lockable._lock(lock_until);
        }

        fn is_locked(ref self: @ContractState) -> (bool, u64) {
            self.lockable._is_locked()
        }
    }
}