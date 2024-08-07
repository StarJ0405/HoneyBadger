import { headers } from 'next/headers';
import { getAPI } from './AxiosAPI';

export const UserApi = getAPI();

UserApi.interceptors.request.use(
    (config) => {
        const TOKEN_TYPE = localStorage.getItem('tokenType');
        const ACCESS_TOKEN = localStorage.getItem('accessToken');
        const REFRESH_TOKEN = localStorage.getItem('refreshToken');
        config.headers['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
        config.headers['REFRESH_TOKEN'] = REFRESH_TOKEN;
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

UserApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
            if (error.response.status === 401 && error.response.data === 'refresh') {
                await refreshAccessToken();
                return UserApi(originalRequest);
            } else if (error.response.status === 403 && error.response.data === 'logout') {
                localStorage.clear();
                window.location.href = '/';
                return;
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const response = await UserApi.get('/api/auth/refresh');
    const TOKEN_TYPE = localStorage.getItem('tokenType');
    const ACCESS_TOKEN = response.data;
    localStorage.setItem('accessToken', ACCESS_TOKEN);
    UserApi.defaults.headers.common['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
};

export const getUser = async () => {
    const response = await UserApi.get('/api/user');
    return response.data;
};

interface SendEmail {
    title: string;
    content: string;
    receiverIds: string[];
    sendTime?: Date | null;
}

interface CreateEmail {
    title: string;
    content: string;
    receiverIds: string[];
}

interface EmailReservationUpdate {
    id: number;
    title: string;
    content: string;
    receiverIds: string[];
    sendTime?: Date | null;
    files: string[];
}

interface MailFile {
    key: string;
    original_name: string;
    value: string;
}

interface ChatroomResponseDTO {
    name?: string;
    users: string[];
}

interface NoticeRequestDTO {
    chatroomId: number;
    messageId: number;
}

interface ChatroomRequestDTO {
    name: string;
    users: string[];
}

interface approvalRequestDTO {
    title: string,
    content: string,
    sender: string,
    approversname: string[],
    viewersname: string[]
}

interface messageReservationRequestDTO {
    chatroomId: number
    message: string
    messageType: number
    reservationDate: Date | null
}

export const getEmail = async (status: number, page: number) => {
    const response = await UserApi.get('/api/email/list', {
        headers: {
            status: status,
            Page: page
        }
    });
    return response.data;
};

export const sendEmail = async (data: CreateEmail) => {
    console.log(data);
    const response = await UserApi.post('/api/email', data);
    return response.data;
};


export const getChat = async (keyword: string, page: number) => {

    const response = await UserApi.get('/api/chatroom/list', {
        headers: {
            keyword: encodeURIComponent(keyword),
            Page: page
        }
    });
    return response.data;
};

export const getChatDetail = async (chatroomId: number, page: number) => {
    const response = await UserApi.get('/api/chatroom',
        {
            headers: { chatroomId: chatroomId, Page: page }
        }
    );
    return response.data;
};

export const getUpdateMessageList = async (chatroomId: number) => {
    const response = await UserApi.get('/api/message/update', { headers: { chatroomId: chatroomId } });
    return response.data;
};

export const createMessageReservation = async (data: messageReservationRequestDTO) => {
    const response = await UserApi.post('/api/messageReservation', data);
    return response.data;
}

export const deleteMessageReservation = async (reservationMessageId: number) => {
    const response = await UserApi.delete('/api/messageReservation', { headers: { reservationMessageId } });
    return response.data;
}

export const editMessageReservation = async (reservationMessageId: number, messageReservationRequestDTO: messageReservationRequestDTO) => {
    const response = await UserApi.put('/api/messageReservation', messageReservationRequestDTO,
        {
            headers: { reservationMessageId: reservationMessageId }
        }
    );
    return response.data;
}

export const messageFileList = async (chatroomId:number) => {
    const response = await UserApi.get('/api/chatroom/file',
        {
            headers : {chatroomId}
        }
    );
    return response.data;
}

export const messageImageList = async (chatroomId:number) => {
    const response = await UserApi.get('/api/chatroom/image',
        {
            headers : {chatroomId}
        }
    );
    return response.data;
}

export const messageLinkList = async (chatroomId:number) => {
    const response = await UserApi.get('/api/chatroom/link',
        {
            headers : {chatroomId}
        }
    );
    return response.data;
}



export const getMessageReservationList = async (page: number) => {
    const response = await UserApi.get('/api/messageReservation/list',
        {
            headers: { Page: page }
        }
    );
    return response.data;
}

export const reservationEmail = async (data: SendEmail) => {
    const response = await UserApi.post('/api/emailReservation/schedule', data);
    return response.data;
};

export const readEmail = async ({ emailId, readerId }: { emailId: number; readerId: string }) => {
    const data = {
        emailId: emailId,
        receiverId: readerId
    };
    const response = await UserApi.put('/api/email/read', data);
    return response.data;
};

export const mailCancel = async (mailId: number) => {
    const response = await UserApi.delete('/api/emailReservation', {
        headers: {
            reservationId: mailId
        }
    });
    return response.data;
};

export const mailImage = async (formData: any) => {
    const response = await UserApi.post('/api/email/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const mailDelete = async (mailId: number) => {
    const response = await UserApi.delete('/api/email', {
        headers: {
            emailId: mailId
        }
    });
    return response.data;
};

export const mailUpdate = async (email: EmailReservationUpdate) => {
    const response = await UserApi.put('/api/emailReservation', email);
    return response.data;
};

export const chatExit = async (data: { chatroomId: number; username: string }) => {
    const response = await UserApi.delete('/api/participant', { headers: data });
    return response.data;
};

export const addUser = async ({ chatroomId, username }: { chatroomId: number; username: string }) => {
    const data = {
        chatroomId: chatroomId,
        username: username
    };
    const response = await UserApi.post('/api/participant', null, { headers: data });
    return response.data;
};

export const editChatroom = async ({ chatroomId, chatroomRequestDTO }: { chatroomId: number; chatroomRequestDTO: ChatroomRequestDTO }) => {
    const response = await UserApi.put('/api/chatroom', chatroomRequestDTO, {
        headers: {
            chatroomId: chatroomId
        }
    });
    return response.data;
};

export const notification = async (data: NoticeRequestDTO) => {
    const response = await UserApi.put('/api/chatroom/notification', data);
    return response.data;
};

export const getUsers = async () => {
    const response = await UserApi.get('/api/user/usernames');
    return response.data;
};

export const emailFiles = async ({ attachments, emailId }: { attachments: FormData; emailId: number }) => {
    const response = await UserApi.post('/api/email/files', attachments, {
        headers: {
            'Content-Type': 'multipart/form-data',
            email_id: emailId
        }
    });
    return response.data;
};

export const reservationFiles = async ({ attachments, emailId }: { attachments: FormData; emailId: number }) => {
    const response = await UserApi.post('/api/emailReservation/files', attachments, {
        headers: {
            'Content-Type': 'multipart/form-data',
            email_id: emailId
        }
    });
    return response.data;
};

export const putProfileImage = async (form: FormData) => {
    const response = await UserApi.put('/api/user/profile_image', form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteProfileImage = async () => {
    const response = await UserApi.delete('/api/user/profile_image');
    return response.data;
};

export const updatePassword = async (prePassword: string, newPassword: string) => {
    const response = await UserApi.put('/api/user', { prePassword: prePassword, newPassword: newPassword });
    return response.data;
};

export const getDepartmentTopList = async () => {
    const response = await UserApi.get('/api/department');
    return response.data;
};

export const postDepartmentImage = async (formData: any) => {
    const response = await UserApi.post('/api/department/img', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

interface PostDepartmentProps {
    name: string;
    url: string;
    parentId: string;
    role: number;
}

export const postDepartment = async (data: PostDepartmentProps) => {
    const response = await UserApi.post('/api/department', data);
    return response.data;
};

export const deleteDepartment = async (departmentId: string) => {
    const response = await UserApi.delete('/api/department', { headers: { DepartmentId: encodeURIComponent(departmentId) } });
    return response.data;
};

export const getDepartmentUsers = async (departmentId?: string) => {
    const response = await UserApi.get('/api/department/users', { headers: { DepartmentId: departmentId ? encodeURIComponent(departmentId) : departmentId } });
    return response.data;
};

interface UserInfo {
    username: string;
    name: string;
    role: number;
    password: string;
    phoneNumber: string;
    joinDate: any;
    department_id: string;
}

export const updateUser = async (data: UserInfo) => {
    const response = await UserApi.put('/api/user/info', data);
    return response.data;
};

export const updateActiveUser = async (data: string) => {
    const response = await UserApi.put('/api/user/status', {}, { headers: { Username: data } });
    return response.data;
};

export const postUser = async (data: UserInfo) => {
    const response = await UserApi.post('/api/user', data);
    return response.data;
};

export const searchUsers = async (keyword: string, page: number, size?: number) => {
    const response = await UserApi.get('/api/user/search', {
        headers: {
            Keyword: keyword ? encodeURIComponent(keyword) : '',
            Page: page,
            Size: size
        }
    });
    return response.data;
};


export const makeChatroom = async (chatroomRequestDTO: ChatroomRequestDTO) => {
    const response = await UserApi.post('/api/chatroom', chatroomRequestDTO);
    return response.data;
};

export const deleteMessage = async (messageId: number) => {
    const response = await UserApi.delete('/api/message', {
        headers: {
            messageId: messageId
        }
    });
    return response.data;
};

export const chatUploadFile = async ({ chatroomId, file }: { chatroomId: number; file: File }) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await UserApi.post('/api/message/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            chatroomId: chatroomId,
        }
    });

    return response.data;
};

export const tempDelete = async () => {
    const response = await UserApi.delete('/api/user/temp');
    return response.data;
};

// Question
interface createQuestionProp {
    title: string,
    content: string,
    author: string,
    password: string,
    lock: boolean
}

export const createQuestion = async (data: createQuestionProp) => {
    const response = await UserApi.post('/api/question', data);
    return response.data;
};

export const getQuestions = async (page: number, keyword: string) => {
    const response = await UserApi.get('/api/question', {
        headers: {
            page: page,
            keyword: keyword ? encodeURIComponent(keyword) : ''
        }
    });
    return response.data;
};

export const checkQuestion = async (data: { password: string, id: number }) => {
    const response = await UserApi.post('/api/question/check', data);
    return response.data;
};
export const updateQuestionAnswer = async (data: { answer: string, id: number }) => {
    const response = await UserApi.put('/api/question', data);
    return response.data;
};

export const readUsersName = async (messageId: number, username: string) => {
    const response = await UserApi.get('/api/message/readUsernames', {
        headers: {
            messageId: messageId,
            username: username
        }
    });
    return response.data;
}

interface cycleRequestDTO {
    title: string;
    content: string;
    startDate: Date | null;
    endDate: Date | null;
    tagName: string;
    tagColor: string;
}

export const createSchedule = async (data: cycleRequestDTO, statusid: number) => {
    const response = await UserApi.post('/api/cycle', data, {
        headers: {
            status: statusid
        }
    });
    return response.data;
};

// 날짜를 ISO 문자열로 변환하는 함수
const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0].substring(0, 5);
};

export const fetchSchedules = async (startDate: Date, endDate: Date, statusid: number) => {
    const formattedStartDate = formatDateToISO(startDate);
    const formattedEndDate = formatDateToISO(endDate);

    const response = await UserApi.get('/api/cycle', {
        headers: {
            status: statusid,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        }
    });
    return response.data;
};

export const updateSchedule = async (id: number, data: cycleRequestDTO, statusid: number) => {
    console.log('Updating schedule:', id, data);
    const response = await UserApi.put(`/api/cycle`, data, {
        headers: {
            id: id,
            status: statusid
        }
    });
    return response.data;
};

export const deleteSchedule = async (id: number) => {
    console.log('Deleting schedule:', id);
    const response = await UserApi.delete(`/api/cycle`, {
        headers: {
            id: id
        }
    });
    return response.data;
};

interface cycleTagRequestDTO {
    name: string,
    color: string
}

export const getTagList = async (statusid: number) => {
    const response = await UserApi.get('/api/cycle/tag', {
        headers: {
            status: statusid,
        }
    });
    return response.data;
};

export const updateTag = async (id: number, data: cycleTagRequestDTO) => {
    console.log('Updating schedule:', id, data);
    const response = await UserApi.put(`/api/cycle/tag`, data, {
        headers: {
            id: id
        }
    });
    return response.data;
};

export const deleteTag = async (id: number) => {
    console.log('Deleting schedule:', id);
    const response = await UserApi.delete(`/api/cycle/tag`, {
        headers: {
            id: id
        }
    });
    return response.data;
};

export const getTagtoCycle = async (id: number) => {
    const response = await UserApi.get(`/api/cycle/tagList`, {
        headers: {
            id: id
        }
    });
    return response.data;
};
/*
 * Storage
 */

export const getStorageFiles = async (data: { Location: string, Page?: number, Type?: number, Order: number, Keyword: string }) => {
    const response = await UserApi.get('/api/file/list', {
        headers: {
            Location: data.Location ? encodeURIComponent(data.Location) : '',
            Page: data.Page,
            Type: data.Type,
            Order: data.Order,
            Keyword: data.Keyword ? encodeURIComponent(data.Keyword) : ''
        }
    });
    return response.data;
};

export const createFileFolder = async (data: { Location: string, Page?: number, Base: string }) => {
    const response = await UserApi.post('/api/file/folder', {}, {
        headers: {
            Location: data.Location ? encodeURIComponent(data.Location) : '',
            Page: data.Page,
            Base: data.Base ? encodeURIComponent(data.Base) : ''
        }
    });
    return response.data;
};

export const getFileFolders = async (data: { Location: string }) => {
    const response = await UserApi.get('/api/file/folders', {
        headers: {
            Location: data.Location ? encodeURIComponent(data.Location) : '',
        }
    });
    return response.data;
};
export const getStorageFile = async (data: { Location: string }) => {
    const response = await UserApi.get('/api/file', {
        headers: {
            Location: data.Location ? encodeURIComponent(data.Location) : '',
        }
    });
    return response.data;
};
export const cancelUpload = async (data: { Key: string, Location: string, Name: string }) => {
    const response = await UserApi.delete('/api/file/cancel', {
        headers: {
            Key: data.Key,
            Location: data.Location ? encodeURIComponent(data.Location) : '',
            Name: data.Name ? encodeURIComponent(data.Name) : ''
        }
    });
    return response.data;
};
export const deleteFile = async (data: { Url: string }) => {
    const response = await UserApi.delete('/api/file', {
        headers: {
            Url: data.Url ? encodeURIComponent(data.Url) : ''
        }
    });
    return response.data;
};
export const downloadFiles = async (data: { urls: string, name: string }) => {
    const response = await UserApi.get('/api/file/download', { responseType: "blob", headers: { Urls: data.urls, Name: data.name } });
    return response.data;
};
/*
 * Approval
 */

export const createApproval = async (approvalRequestDTO: approvalRequestDTO) => {
    const response = await UserApi.post('/api/approval', approvalRequestDTO);
    return response.data;
};

export const readApproval = async (approvalId: number) => {
    const response = await UserApi.put('/api/approval/updateRead', null, {
        headers: {
            approvalId: approvalId
        }
    });
    return response.data;
};

export const deleteApproval = async (approvalId: number) => {
    const response = await UserApi.delete('/api/approval', {
        headers: {
            approvalId: approvalId
        }
    });
    return response.data;
};

// export const getApprovalList = async () => {
//     const response = await UserApi.get('/api/approval/list');
//     return response.data;
// };

// export const getApprovalList = async (keyword: string) => {
//     const response = await UserApi.get('/api/approval/list', {
//         headers: {
//             keyword: encodeURIComponent(keyword)
//         }
//     });
//     return response.data;
// };

export const getApprovalList = async (keyword: string, page: number) => {
    const response = await UserApi.get('/api/approval/list', {
        headers: {
            keyword: encodeURIComponent(keyword),
            Page: page
        }
    });
    return response.data;
};

export const acceptApproval = async (approvalId: number, binary: boolean) => {
    const response = await UserApi.post('/api/approver', null, {
        headers: {
            approvalId: approvalId,
            Binary: binary.toString()
        }
    });
    return response.data;
};

// export const approvalFiles = async ({ approvalId, attachments }: { approvalId: number; attachments: FormData; }) => {
//     const response = await UserApi.post('/api/approval/files', attachments, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//             approvalId: approvalId
//         }
//     });
//     return response.data;
// };

export const approvalFiles = async ({ attachments, approvalId }: { attachments: FormData; approvalId: number }) => {
    const response = await UserApi.post('/api/approval/files', attachments, {
        headers: {
            'Content-Type': 'multipart/form-data',
            approvalId: approvalId
        }
    });
    return response.data;
};

export const updateViewer = async (approvalId: number, approvalRequestDTO: approvalRequestDTO) => {
    const response = await UserApi.post('/api/viewer', approvalRequestDTO, {
        headers: {
            approvalId: approvalId
        }
    });
    return response.data;
};

export const unsubscribeChatroom = async (name:string) => {
    const response = await UserApi.put('/api/message/unsubscribe',null,{
        headers:{
            name:name
        }
    });
    return response.data;
};