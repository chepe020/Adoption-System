import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '') => {
       return new Promise((resolve, reject) => {
        
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.ME92MO93CHE0330234,
            {
                expiresIn: '1h'
            },
            (err, token)=>{
                err ? (console.log(err), reject("El Token No Se Ha Generado")) : resolve(token);
            }
        );
       }); 
}