"use server"
import {prisma} from '@/utils/prisma'

type EditTaskProps = {
    idTask: string
    newtask: string
}

export const editTask= async ({idTask, newtask}: EditTaskProps ) => {
    try{
        if(!idTask || !newtask) return

        const editedTask = await prisma.task.update({
            where: {id: idTask},
            data: {task: newtask}
        })

        if(!editedTask) return

    }catch (error){
        throw error
    }
}