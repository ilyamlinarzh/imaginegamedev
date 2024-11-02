

export class ActionsHandler {
    private methods: {[key: string]: (data: any) => void} = {}

    addMethods(data: [string, (data: any) => void][]) {
        data.forEach(([name, method])=>{
            this.methods[name] = method
        })
    }

    executeMethod(method: string, data: any) {
        this.methods[method](data);
    }
}