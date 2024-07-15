export function Move(id: string) {
    document.getElementById(id)?.focus();
}
export function KeyDownCheck({ preKey, setPreKey, e, pre, next }: { preKey: string, setPreKey: (value: any) => void, e: any, pre?: () => void, next?: () => void }) {
    if (pre && preKey != '' && e.key == 'Enter')
        pre();
    else if (next && preKey == '' && e.key == 'Enter')
        next();
    if (e.key == 'Shift')
        setPreKey('Shift');
    else if (preKey != null)
        setPreKey('');
}

export function PhoneString(phone: string) {
    return phone?.slice(0, 3) + "-" + phone?.slice(3, 7) + "-" + phone?.slice(7);
}
export function checkInput(check: any, pattern: string, True: () => void, False: () => void) {
    if (new RegExp(pattern).test(check.target.value))
        True();
    else
        False();
}
export function PhoneNumberCheck(e: any) {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 3 && input.value.charAt(3) != '-') {
        const value = input.value;
        input.value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (input.value.length > 8 && input.value.charAt(8) != '-') {
        const value = input.value;
        input.value = value.slice(0, 8) + '-' + value.slice(8);
    }
    if (input.value.length > 13)
        input.value = input.value.slice(0, 13);
    if (input.value.lastIndexOf('-') == input.value.length - 1)
        input.value = input.value.slice(0, input.value.length - 1);

}
export function Check(pattern: string, test: string) {
    return new RegExp(pattern).test(test);
}
export function getDate(data: any) {
    const date = new Date(data);
    return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
}
export function getDateKorean(data: any) {
    const date = new Date(data);
    return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + "일";
}
export function getDateTime(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes();
}
export function getDateTimeFormat(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " " + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}
export function getDateTimeFormatInput(data: any) {
    const date = new Date(data);
    return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + "T" + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
}
export function transferLocalTime(date: Date) {
    return new Date(date.getTime() + 9 * 1000 * 60 * 60);

}

export function eontransferLocalTime(date: Date | null) {
    if (date != null) {
        return new Date(date.getTime() + 9 * 1000 * 60 * 60);
    } else {
        return null;
    }

}

export function eongetDateTimeFormat(data: any) {
    const date = new Date(data);
    return date;
}

export function getChatDateTimeFormat(data: any) {
    const date = new Date(data);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const hours = date.getHours();
    const amPm = hours >= 12 ? '오후' : '오전';
    const formattedHour = hours % 12 || 12;  // 0시는 12시로 표현

    const formattedTime = amPm + " " + (formattedHour < 10 ? '0' + formattedHour : formattedHour) + ":"
        + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

    if (isToday) {
        // 오늘 날짜인 경우 시간만 반환
        return formattedTime;
    } else {
        // 오늘이 아닌 경우 날짜와 시간 모두 반환
        return date.getFullYear() + "-" +
            (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-"
            + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " "
            + formattedTime;
    }
}
export function getRole(role: number) {
    switch (role) {
        case 0: return "사장"
        case 1: return "부사장"
        case 2: return "전무"
        case 3: return "상무"
        case 4: return "이사"
        case 5: return "사외 이사"
        case 6: return "고문"
        case 7: return "감사"
        case 8: return "부장"
        case 9: return "과장"
        case 10: return "대리"
        case 11: return "주임"
        case 12: return "직원"
    }
}
export function CardFront({ user }: { user: any }) {
    return <div className="border border-black w-[400px] h-[200px] flex flex-col">
        <div className="flex h-[150px] mt-auto">
            <div className="mx-auto flex flex-col">
                <div className="flex flex-col mt-4">
                    <label className="font-bold text-[#8fbee9]">HoneyBadger</label>
                    <label className="text-xxs text-center text-gray-500">Don't hold back. Be brave</label>
                </div>
                <div className="mt-auto flex flex-col h-[60px]">
                    <div className="flex  items-center my-auto">
                        <img src='/_phone.png' className="w-[20px] h-[20px] mr-2" />
                        <label className="text-xxs">{PhoneString(user?.phoneNumber)}</label>
                    </div>
                    <div className="flex items-center my-auto">
                        <img src='/_call.png' className="w-[20px] h-[20px] mr-2" />
                        <label className="text-xxs">1312</label>
                    </div>
                    <div className="flex items-center my-auto">
                        <img src='/_mail.png' className="w-[20px] h-[20px] mr-2" />
                        <label className="text-xxs">{user?.username}@honeybadger.com</label>
                    </div>
                </div>
            </div>
            <div className="mx-auto flex flex-col">
                <div className="flex flex-col mt-4">
                    <label className="font-bold text-[#8fbee9]">{user?.name}</label>
                    <label className="text-xs text-gray-500">{getRole(user?.role)}</label>
                </div>

                <div className="mt-auto flex flex-col h-[60px]">
                    <div className="flex items-center my-auto">
                        <img src='/_web.png' className="w-[20px] h-[20px] mr-2" />
                        <label className="text-xxs">www.벌꿀오소리.메인.한국</label>
                    </div>
                    <div className="flex items-center my-auto">
                        <img src='/_location.png' className="w-[20px] h-[20px] mr-2" />
                        <label className="text-xxs">대전광역시 서구 둔산로 52 3층</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full h-[20px] bg-[#8fbee9] mt-auto"></div>
    </div>
}
export function CardBack() {
    return <div className="border bg-[#8fbee9] border-black w-[400px] h-[200px] flex flex-col items-center justify-center relative">
        <div className="flex">
            <img src='/_logo.png' className="w-[75px] h-[50px] mr-2 bg-yellow-500 rounded-full p-2" />
            <div className="flex flex-col">
                <label className="font-bold text-white text-lg">HoneyBadger</label>
                <label className="text-xxs text-center text-gray-300">Don't hold back. Be brave</label>
            </div>
        </div>
        <div className="bottom-[16px] absolute text-white text-xs">SEO | Web Devlopement | App Development </div>
    </div>
}