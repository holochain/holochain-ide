#![feature(proc_macro_hygiene)]
use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize};
use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
    holochain_core_types::time::Iso8601,
    holochain_persistence_api::cas::content::Address,
    api::AGENT_ADDRESS,
};
use holochain_anchors;

pub mod origin;
use crate::origin::OriginEntry;
use crate::origin::Origin;

pub mod profile;
use crate::profile::ProfileEntry;
use crate::profile::Profile;

#[zome]
mod origins {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[zome_fn("hc_public")]
    fn agent_address() -> ZomeApiResult<String> {
        Ok(AGENT_ADDRESS.to_string())
    }

    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }

    #[zome_fn("hc_public")]
    fn list_anchor_type_addresses() -> ZomeApiResult<Vec<Address>> {
        holochain_anchors::list_anchor_type_addresses()
    }

    #[zome_fn("hc_public")]
    fn list_anchor_type_tags() -> ZomeApiResult<Vec<String>> {
        holochain_anchors::list_anchor_type_tags()
    }    
  
    #[zome_fn("hc_public")]
    fn list_anchor_addresses(anchor_type: String) -> ZomeApiResult<Vec<Address>> {
        holochain_anchors::list_anchor_addresses(anchor_type)
    }

    #[zome_fn("hc_public")]
    fn list_anchor_tags(anchor_type: String) -> ZomeApiResult<Vec<String>> {
        holochain_anchors::list_anchor_tags(anchor_type)
    }
    

    #[entry_def]
    fn profile_entry_def() -> ValidatingEntryType {
        profile::definition()
    }

    #[zome_fn("hc_public")]
    fn create_profile(base: String, profile_input: ProfileEntry) -> ZomeApiResult<Profile> {
        profile::handlers::create(base, profile_input)
    }

    #[zome_fn("hc_public")]
    fn read_profile(id: Address, created_at: Iso8601) -> ZomeApiResult<Profile> {
        profile::handlers::read(id, created_at)
    }

    #[zome_fn("hc_public")]
    fn update_profile(id: Address, created_at: Iso8601, address: Address, profile_input: ProfileEntry) -> ZomeApiResult<Profile> {
        profile::handlers::update(id, created_at, address, profile_input)
    }

    #[zome_fn("hc_public")]
    fn delete_profile(base: String, id: Address, created_at: Iso8601, address: Address) -> ZomeApiResult<Address> {
        profile::handlers::delete(base, id, created_at, address)
    }

    #[zome_fn("hc_public")]
    fn list_profiles(base: String) -> ZomeApiResult<Vec<Profile>> {
        profile::handlers::list(base)
    }
    #[entry_def]
     fn origin_entry_def() -> ValidatingEntryType {
        origin::definition()
    }

    #[zome_fn("hc_public")]
    fn create_origin(base: String, origin_input: OriginEntry) -> ZomeApiResult<Origin> {
        origin::handlers::create(base, origin_input)
    }

    #[zome_fn("hc_public")]
    fn read_origin(id: Address, created_at: Iso8601) -> ZomeApiResult<Origin> {
        origin::handlers::read(id, created_at)
    }

    #[zome_fn("hc_public")]
    fn update_origin(id: Address, created_at: Iso8601, address: Address, origin_input: OriginEntry) -> ZomeApiResult<Origin> {
        origin::handlers::update(id, created_at, address, origin_input)
    }

    #[zome_fn("hc_public")]
    fn delete_origin(base: String, id: Address, created_at: Iso8601, address: Address) -> ZomeApiResult<Address> {
        origin::handlers::delete(base, id, created_at, address)
    }

    #[zome_fn("hc_public")]
    fn list_origins(base: String) -> ZomeApiResult<Vec<Origin>> {
        origin::handlers::list(base)
    }

    #[zome_fn("hc_public")]
    fn rebase_origin(base_from: String, base_to: String, id: Address, created_at: Iso8601) -> ZomeApiResult<Address> {
        origin::handlers::rebase(base_from, base_to, id, created_at)
    }

}