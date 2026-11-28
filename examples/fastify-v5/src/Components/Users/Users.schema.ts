

export const User={
    type:"object",
    properties:{ 
        username:{ type:"string" },
    },
}

export const Endpoint={
    response:{
        200:User,
    },
};
