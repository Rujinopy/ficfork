
//import Edtior from editor.js
import React, { useEffect, useRef} from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
// import List from '@editorjs/list'
import ImageTool from '@editorjs/image'
import Paragraph from '@editorjs/paragraph'
import SimpleImage from '@editorjs/simple-image'    
import List from '@editorjs/list'
import { CloudImage } from './cloundImage'
type Props = {
    content: String;
    setContent: React.Dispatch<React.SetStateAction<EditorJS>>;
}

const initialData = () => {
    return {
        time: 1556098174501,
        blocks: [
            {
                type: "header",
                data: {
                    text: "Edit thist text.",
                    level: 2   
            }
        },
    ]
}
}

export default function CustomEditor(props : any) {
    const { content, setContent} = props
    
    // console.log(content);
    
    const editor = useRef(null)

    const onFileChange = async(file:File)=> {
        const form_data = new FormData()
        // console.log(file);
        
        let preset = process.env.NEXT_PUBLIC_PRESET
        if(preset){
            form_data.append('upload_preset',preset)
        }

        if(file){
            form_data.append('file',file)
            const imageUrl =await CloudImage(form_data)
            if(imageUrl){
                // console.log(imageUrl);
                
                 return imageUrl
        }
        }
    }

    useEffect(() => {

        const editorjs= new EditorJS({
        holder: 'editorjs',
        data: content === '' ? initialData() : (JSON.parse(content)),
        autofocus: true,
        tools: {
            header: {
            class: Header,
            inlineToolbar: true,
            config: {
                placeholder: 'Header',
            },
            shortcut: 'CMD+SHIFT+H',
            },
            List: {
                class: List,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+L',
            },
            image: {
            class: ImageTool,
            config: {
                uploader: {
                    async uploadByFile(file:File){
                       return onFileChange(file).then((imageUrl)=>{
                         return {
                         success:1,
                         file:{
                           url:imageUrl
                         }
                         }
                       }
                       )
                     }
                   }
            },
            }
        },
        onReady: () => {
            //editorjs.save the initial data
            editorjs.save().then((outputData: any) => {
                const data = JSON.stringify(outputData)
                // console.log('Article data: ', outputData);
                setContent(outputData)
            }
            ).catch((error: any) => {
                console.log('Saving failed: ', error)
            }
            )
        }
        ,onChange: async () => {
           const change = await editorjs.save().then((outputData: any) => {
                const data = JSON.stringify(outputData)
                // console.log('Article data: ', outputData);                
                setContent(outputData)
            }).catch((error: any) => {
                console.log('Saving failed: ', error)
            })
        }
    })
    }, [])
    return (
        <div className=''>
            <div className='' id="editorjs"></div>
        </div>
    )
}
