import mongoose from "mongoose"

const todosSchema = new mongoose.Schema({
    createdBy: {
      type: String
    },
    content:{
      type: String,

    },
    done:{
      type: Boolean,
      default: false
    },
    dateCreated:{
      type: Date,
      default: Date.now()
    }
});

const Todos = mongoose.model("Todo", todosSchema);

export default Todos;