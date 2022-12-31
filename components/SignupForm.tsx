import { redirect } from "next/dist/server/api-utils";
import { type } from "os";
import { SubmitHandler, useForm } from "react-hook-form"


type FormValues = {
    email: string;
    password: string;
    passwordConfirmation: string;
}

// fetch exiting emails from database
const existingEmail = () => {
    fetch('/api/signup', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

export default function SignupForm() {
    const { register, handleSubmit } = useForm<FormValues>();
    const onsubmit: SubmitHandler<FormValues> = (data) => {
        if(data.email === "") {
            alert("Email is required")
        }
        else if (data.password === "") {
            alert("Password is required")
        }
        else if (data.passwordConfirmation === "") {
            alert("Password confirmation is required")
        }
        
        if(data.email.indexOf("@") === -1) {
            alert("Email is invalid")
        }
        
        //if this email is already in the database, alert user

        if(data.password.length < 6) {
            alert("Password must be at least 6 characters long")
        }
        else if(data.password !== data.passwordConfirmation) {
            alert("Passwords do not match")
        }
        else {
            fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = "/";
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        
    }

    return (
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-row border border-black rounded-xl p-8 my-20">
            <div className="basis-1/2 mx-auto my-auto">
                <h1 className="text-4xl text-bold text-center">ficfork</h1>
            </div>
            <div className="basis-1/2 flex flex-col space-y-4 w-full">
                <h1 className="text-2xl font-bold mb-4">Sign up</h1>
                <label className="text-xl" htmlFor="email">Email</label>
                <input required className="py-2 px-1 border border-black rounded-lg" type="email" {...register("email")}/>
                <label className="text-xl" htmlFor="password">Password</label>
                <input required className="py-2 px-1 border border-black rounded-lg" type="password" {...register("password")}/>
                <label className="text-xl" htmlFor="passwordConfirmation">Password Confirmation</label>
                <input required className="py-2 px-1 border border-black rounded-lg" type="password" {...register("passwordConfirmation")} />
                <button className="p-3 bg-black text-white rounded-lg hover:bg-red-600" type="submit">Sign up</button>
            </div>
        </form>
        )}