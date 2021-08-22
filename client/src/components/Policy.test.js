const Policy = require("./Policy")
// @ponicode
describe("componentDidMount", () => {
    let inst

    beforeEach(() => {
        inst = new Policy.default()
    })

    test("0", async () => {
        await inst.componentDidMount()
    })
})
