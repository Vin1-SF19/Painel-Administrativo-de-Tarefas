"use server"
import { prisma } from "@/utils/prisma"

export const UpdateTaskStatus = async (taskId: string) => {
   try{
     const currentTask = await prisma.task.findUnique({
        where: {id: taskId}
    })

    const updatedStatus = await prisma.task.update({
        where: {id: taskId},
        data: {done: !currentTask.done}
    })
    if(!updatedStatus) return
    console.log(updatedStatus)
    return updatedStatus
   }catch (error){
    throw error
   }
}