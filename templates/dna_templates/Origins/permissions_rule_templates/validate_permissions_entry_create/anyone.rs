// Anyone allowed to create
pub fn validate_permissions_entry_create(entry: OriginEntry, validation_data: hdk::ValidationData) -> Result<(), String> {
    validation::validate_entry_create(entry, validation_data)
}