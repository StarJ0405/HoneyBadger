"use client";

import { useEffect, useState } from "react";
import Main from "../Global/Layout/MainLayout";
import { getUser } from "../API/UserAPI";
import { getDate } from "../Global/Method";

export default function HOME() {
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser().then(r => setUser(r)).catch(e => console.log(e));
    }, [ACCESS_TOKEN])
    function getRole(role: number) {
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
    return <Main>
        <div className="w-full flex items-center justify-center p-10">
            <div className="w-full bg-white h-full shadow p-2 flex flex-col text-lg items-center">
                <div className="flex">
                    <img src={user?.url ? user?.url : '/base_profile.png'} alt="profile" className="w-[100px] h-[100px]" />
                    <table>
                        <tbody className="text-start">
                            <tr>
                                <th className="fotn-bold w-[200px]">id</th>
                                <td>{user?.username}</td>
                            </tr>
                            <tr>
                                <th className="fotn-bold">이름</th>
                                <td>{user?.name}</td>
                            </tr>
                            <tr>
                                <th className="fotn-bold">부서</th>
                                <td>{user?.department?.name?user?.department?.name:"미할당"}</td>
                            </tr>
                            <tr>
                                <th className="fotn-bold">직책</th>
                                <td>{getRole(user?.role)}</td>
                            </tr>
                            <tr>
                                <th className="fotn-bold">비밀번호</th>
                                <td><label className="hover:underline cursor-pointer">변경하기</label></td>
                            </tr>
                            <tr>
                                <th className="fotn-bold">전화번호</th>
                                <td>{user?.phoneNumber}</td>
                            </tr>
                            <tr>
                                <th className="fotn-bold">입사일</th>
                                <td>{getDate(user?.joinDate)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Main>
}