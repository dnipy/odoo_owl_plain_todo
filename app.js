const { Component , mount , xml , useState  } = owl;

class Task extends Component {
    static template = xml`
        <li t-attf-style="background-color:#{state.color}" class="d-flex align-items-center justify-content-between  border p-3 mb-2 rounded" >
            <div t-if="state.isEditing" class="d-flex align-items-center flex-grow-1 me-2">
                <input type="text" class="form-conrtol" t-model="state.name" />
                <input type="color" style="width:60px" t-model="state.color" title="choose your color" class="form-control-lg form-control-color border-0 bg-white " id="color"/>
            </div>
            <div t-if="!state.isEditing" class="form-check form-switch ">
                <input 
                    class="form-check-input" 
                    type="checkbox" 
                    value="" 
                    t-att-checked="state.icCompleted" 
                    t-att-id="state.id" 
                    t-on-click="toggleTask" 
                />
                <label 
                    class="form-check-label"
                    t-att-for="state.id" 
                    t-attf-class="#{state.icCompleted ? 'text-decoration-line-through' : ''}"
                >
                    <t t-esc="state.name" />
                </label>
            </div>
            <div>
                <button t-if="!state.isEditing" t-on-click="editTask" class="btn btn-primary me-2">
                    <i class="bi bi-pencil fs-3" ></i>
                </button>
                <button t-if="state.isEditing" t-on-click="saveTask" class="btn btn-primary me-2">
                    <i class="bi bi-check fs-3" ></i>
                </button>
                <button t-on-click="deleteTask" class="btn btn-danger">
                    <i class="bi bi-trash fs-3" ></i>
                </button>
            </div>
        </li> 
    `
    static props = ["task","onDelete","onEdit"]
    
    setup(){
        this.state= useState({
            isEditing : false,
            id : this.props.task.id,
            name : this.props.task.name,
            color : this.props.task.color,
            isCompleted : this.props.task.isCompleted
        })
    }
    
    toggleTask(){ 
        this.state.icCompleted = !this.state.icCompleted
    }
    deleteTask(){ 
        this.props.onDelete(this.props.task)
    }
    editTask(){
        this.state.isEditing = true
    }
    saveTask(){ 
        this.state.isEditing = false;
        this.props.onEdit(this.state)
    }
}


class Root extends Component {
    static template = xml`
        <div class="mt-5">
            <div class="input-group-lg w-100 d-flex p-2 rounded align-items-center ">
                <input type="text" class="form-control-lg flex-fill border-0 me-1" placeholder="Add your task" t-att-value="state.name" t-model="state.name" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                <input type="color" class="form-control-lg form-control-color border-0 bg-white m-0 " t-att-value="state.color" t-model="state.color" id="color"/>
                <button class="btn btn-primary" type="button" id="button-addon2" t-on-click="addTask">
                    <i class="bi bi-plus-lg fs-3"></i>
                </button>
            </div>
        </div>

        <ul class="d-flex flex-column mt-2 p-0">
            <t t-foreach="tasks" t-as="task" t-key="task.id">
                <Task task="task" onDelete.bind="deleteTask" onEdit.bind="editTask"/>
            </t>
        </ul>
    `
    static components = {Task}
    setup(){
        this.state = useState({
            name : '',
            color : '#FFF000',
            icCompleted : false 
        })
        this.tasks = useState([])

    }
    addTask(){
        if (!this.state.name) return
        this.tasks.push({
            id : this.tasks.length + 1 || 1,
            ...this.state
        })

        this.state = {...this.state , name : '', color :"#FFF000"}
    }
    deleteTask(task){
        const idx = this.tasks.findIndex(t=>t.id == task.id  )
        this.tasks.splice(idx,1)
    }
    editTask(task){
        const idx = this.tasks.findIndex(t=>t.id == task.id  )
        this.tasks.splice(idx,1,task)
    }
}


mount(Root,document.getElementById(`root`))