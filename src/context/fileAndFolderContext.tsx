import "client-only"
import React, { useContext, useEffect, useState } from "react";
import Loading from "@/loading";
import { useTokenData } from "./tokenContext";



const FolderDataContext = React.createContext({});
const SetFolderDataContext = React.createContext({});
const FolderPathContext = React.createContext({});






export function useFileAndFolderData() { return useContext(FolderDataContext) }
export function useSetFilesAndFoldersData() { return useContext(SetFolderDataContext) }
export function useFolderPath() { return useContext(FolderPathContext) }


export default function FilesAndFoldersDataProvider({ parent, children }: {
    parent: string
    children: any
}) {

    const [filesAndFoldersData, setFilesAndFoldersData] = useState<any[]>([])
    const [path, setPath] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const tokenData = useTokenData();


    async function fetchFilesAndFoldersData() {


        const timeOut = setTimeout(() => {
            setIsLoading(true)
        }, 300);


        const data = await fetch('/api/folder', {
            method: "POST",
            headers: {
                "Authentication": `Bearer ${localStorage.getItem('apCloudAccessToken')}`
            },
            body: JSON.stringify({ parent })

        }).then(res => res.json())

        clearTimeout(timeOut);
        setIsLoading(false)


        if (data.err) {
            console.log(data.err)
            return;
        }


        setPath(data.path)
        setFilesAndFoldersData(data.filesAndFolders)

    }



    useEffect(() => {
        if (localStorage.getItem('apCloudAccessToken'))
            fetchFilesAndFoldersData()
    }, [])


    if (isLoading) return <Loading />
    return <FolderDataContext.Provider value={filesAndFoldersData}>
        <SetFolderDataContext.Provider value={setFilesAndFoldersData}>
            <FolderPathContext.Provider value={path}>


                {children}


            </FolderPathContext.Provider>
        </SetFolderDataContext.Provider>
    </FolderDataContext.Provider>
}