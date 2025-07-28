


export const GenerateId = (title:string):string =>{
    
    const randomId =  `${title}-${Date.now()}-${Math.random().toString(36).substring(2,10)}`
    return randomId
}