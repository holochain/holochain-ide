module.exports = (scenario, conductorConfig) => {
  scenario("create_task", async (s, t) => {
    const {alice} = await s.players({alice: conductorConfig}, true)
    const create_task_result = await alice.call("tasks", "tasks", "create_task", {"task_input" : {"title":"Title first task", "done":"false"}})
    await s.consistency()
    console.log(create_task_result)
    const read_task_result = await alice.call("tasks", "tasks", "read_task", {"id": create_task_result.Ok.id, "created_at": create_task_result.Ok.createdAt})
    t.deepEqual(create_task_result, read_task_result)
    t.deepEqual(read_task_result.Ok.title, 'Title first task')
    t.deepEqual(read_task_result.Ok.content, 'Content first task')
  })

  scenario("list_tasks", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    await alice.call("tasks", "tasks", "create_task", {"task_input" : {"title":"Title first task", "done":"false"}})
    await alice.call("tasks", "tasks", "create_task", {"task_input" : {"title":"Title second task", "done":"false"}})
    await alice.call("tasks", "tasks", "create_task", {"task_input" : {"title":"Title third task", "done":"false"}})
    await alice.call("tasks", "tasks", "create_task", {"task_input" : {"title":"Title fourth task", "done":"false"}})
    await s.consistency()
    const result = await alice.call("tasks", "tasks", "list_tasks", {})
    t.deepEqual(result.Ok.length, 4)
  })


