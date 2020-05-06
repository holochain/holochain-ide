scenario("anyone-delete-column", async (s, t) => {
  const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
  const create_column_result = await alice.call("columns", "columns", "create_column", {"base": "testbase", "column_input" : {"uuid":uuidv4(), "title":"Title first column", "order": 1}})
  await s.consistency()
  const list_columns_result = await alice.call("columns", "columns", "list_columns", {"base": "testbase"})
  t.deepEqual(list_columns_result.Ok.length, 1)
  await bob.call("columns", "columns", "delete_column", {"base": "testbase", "id": create_column_result.Ok.id, "created_at": create_column_result.Ok.createdAt, "address": create_column_result.Ok.address })
  await s.consistency()
  const list_columns_result_2 = await alice.call("columns", "columns", "list_columns", {"base": "testbase"})
  t.deepEqual(list_columns_result_2.Ok.length, 0)
})