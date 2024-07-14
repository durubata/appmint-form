import axios from 'axios';

const getResourcePath = (resourceName: string) => {
    return ``;
}

export async function uploadWithProgress(location: string, file, onProgress) {
    // notificationStore.showSiteBusy(true);

    console.debug('request -> updateData', file);

    const path = getResourcePath(appEndpoints.file_upload.name);
    const formData = new FormData();
    formData.append('location', location);
    formData.append('file', file);

    const config = {
        headers: {
            Authorization: activeSession.getToken(),
            orgid: appConfig.siteId,
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (onProgress) {
                onProgress(percentCompleted);
            }
        }
    };

    try {
        let rt = await axios.post(path, formData, config);
        console.debug('upload -> success', path);
        return rt.data;
    } catch (error) {
        console.error('upload - error', path);
        console.error(error);
        // notificationStore.addNotification({ message: 'File Upload failed: ' + error.message, type: SiteNotificationType.Error, });
    } finally {
        // notificationStore.showSiteBusy(false);
    }
}


export async function deleteFile(location: string) {
    return ''
}