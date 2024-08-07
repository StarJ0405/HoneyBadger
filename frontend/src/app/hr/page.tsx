"use client";
import {  useEffect, useState } from "react";
import Main from "../Global/Layout/MainLayout";
import DropDown, { Direcion } from "../Global/DropDown";
import { deleteDepartment, getDepartmentTopList, getDepartmentUsers, getUser, postDepartment, postDepartmentImage, postUser, searchUsers, updateActiveUser, updateUser } from "../API/UserAPI";

import { getDateFormatInput, getDateKorean, getDepartmentRole, getRole, PhoneNumberCheck, translateDex } from "../Global/Method";
import Modal from "../Global/Modal";




export default function Page() {
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [departmentList, setDepartmentList] = useState([] as any[]);
    const [select, setSelect] = useState(null as any);
    const [dropDown, setDropDown] = useState(null as any);
    const [folds, setFold] = useState([] as any[]);
    const [selectFolds, setSelectFold] = useState([] as any[]);
    const [detailFolds, setDetailFold] = useState([] as any[]);
    const [departmentUsers, setDepartmentUsers] = useState(null as any);
    const [selectUser, setSelectUser] = useState(null as any);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState(-1);
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [openDepartment, setOpenDepartment] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [departmentRole, setDepartmentRole] = useState(0);
    const [addPeople, setAddPeople] = useState(false);
    const [isClientLoading, setClientLoading] = useState(true);
    const [isUserLoadOpen, setUserLoadOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [searchInterval, setSearchInterval] = useState(null as any);
    const [searchedUsers, setSearchedUsers] = useState([] as any[]);
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser().then(r => {
                setUser(r);
                getDepartmentTopList().then(r => {
                    setDepartmentList(r);
                    const interval = setInterval(() => { setClientLoading(false); clearInterval(interval); }, 1000);
                }).catch(e => {
                    setClientLoading(false);
                    console.log(e);
                });
                if (r?.role != 13 && r?.department?.role != 1)
                    location.href = "/";
            }).catch(e => console.log(e));
    }, [ACCESS_TOKEN])

    function Department(props: { department: any, stack?: number, location?: String }) {
        const department = props?.department;
        const location = props?.location ? props?.location + " - " + department.name : department.name;
        const stack = props?.stack ? props.stack + 1 : 1;

        return <>
            <div className={"w-full flex items-center p-2 rounded-lg mt-3 min-h-[2.5rem] overflow-y-hidden cursor-pointer" + (select?.name == department.name ? " bg-orange-300 hover:bg-red-300" : " hover:bg-gray-300")} onClick={() => {
                setSelect(department);
                if (dropDown?.name && dropDown?.name != department?.name) setDropDown(null);
                if (department.name != select?.name)
                    getDepartmentUsers(department?.name).then(r => {
                        setDepartmentUsers(r); setDetailFold([])
                    }).catch(e => console.log(e));
                if (department.child.length <= 0) return;
                if (folds.includes(department) && select?.name == department.name) setFold([...folds.filter(f => f.name != department.name)]);
                else setFold([...folds, department]);
            }}>
                <div className="min-h-[2.5rem] mr-1" style={{ backgroundColor: "#" + translateDex(255 - (stack % 3 == 0 ? stack * 30 % 256 : 0)) + translateDex(255 - (stack % 3 == 1 ? stack * 30 % 256 : 0)) + translateDex(255 - (stack % 3 == 2 ? stack * 30 % 256 : 0)), width: stack * 5 }}></div>
                <img src={department?.url ? department?.url : "/logo.png"} className="w-[2.5rem] h-[2.5rem] mr-2" />
                <div className="flex flex-col">
                    <label className="font-bold text-lg cursor-pointer">{department.name}<label className="text-xs">({getDepartmentRole(department?.role)})</label></label>
                    {props?.location ? <label className="text-xs cursor-pointer">{props?.location + " - " + department?.name}</label> : <></>}
                </div>
                <div className="flex flex-col ml-auto items-end">
                    <div id={department?.name} className="mail-hamburger pl-6" onClick={() => { department && department?.name == dropDown?.name ? setDropDown(null) : setDropDown(department) }}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <label className="text-xxs cursor-pointer">{getDateKorean(department.modifyDate)} / {getDateKorean(department.createDate)}</label>
                </div>
            </div>
            {!folds.includes(department) ? <></> : (department?.child as any[]).map((department, index) => <Department key={index} department={department} location={location} stack={stack} />)}

        </>
    }
    function SelectDepartment(props: { department: any, stack?: number }) {
        const department = props?.department;
        const stack = props?.stack ? props.stack + 1 : 1;
        return <>
            <div className="flex border-2 mb-2 p-2 rounded-lg" style={{ backgroundColor: "#" + translateDex(255 - (stack % 3 == 0 ? stack * 30 % 256 : 0)) + translateDex(255 - (stack % 3 == 1 ? stack * 30 % 256 : 0)) + translateDex(255 - (stack % 3 == 2 ? stack * 30 % 256 : 0)) }}>
                {department?.child.length > 0 ?
                    <label className="w-full cursor-pointer" onClick={() => { if (selectFolds.includes(department)) setSelectFold([...selectFolds.filter(f => f.name != department.name)]); else setSelectFold([...selectFolds, department]) }}>{"-".repeat(stack - 1)}{department?.name}</label>
                    :
                    <label className="w-full">{"-".repeat(stack - 1)}{department?.name}</label>
                }
                <button className="w-[2.5rem] font-bold hover:underline" onClick={() => {
                    setOpenDepartment(false);
                    setDepartmentId(department?.name);
                }}>선택</button>
            </div>
            {!selectFolds.includes(department) ? <></> : (department?.child as any[]).map((department, index) => <SelectDepartment key={index} department={department} stack={stack} />)}
        </>
    }
    function getSize(departmentUsers: any) {
        let count = departmentUsers?.users?.length;;
        (departmentUsers?.child as any[])?.forEach(child => count += getSize(child));
        return count;
    }
    function Detail(props: { departmentUsers: any, stack?: number }) {
        const departmentUsers = props.departmentUsers;
        const users = departmentUsers?.users;
        const size = getSize(departmentUsers);
        const stack = props?.stack ? props.stack + 1 : 1;
        return <>
            <div className="mb-4 flex flex-col border-2 border-black p-4 rounded-lg" style={{ marginLeft: (stack-1) * 2.5+'rem', backgroundColor: "#" + translateDex(255 - (stack % 3 == 0 ? stack * 30 % 256 : 0)) + translateDex(255 - (stack % 3 == 1 ? stack * 30 % 256 : 0)) + translateDex(255 - (stack % 3 == 2 ? stack * 30 % 256 : 0)) }}>
                <label className="font-bold w-full text-2xl">{departmentUsers?.name ? departmentUsers.name : '무소속 사용자'}<label className="text-base font-normal">({getDepartmentRole(departmentUsers?.role)})</label></label>
                <label className="text-start text-sm w-full">총 {size} 명(직속 {users?.length}명 / 예하 {size - users?.length}명)</label>
                {users?.length == 0 ? <label>해당 부서에 직속 할당된 인원이 없습니다.</label>
                    :
                    <div className="mt-4">
                        <table>
                            <thead>
                                <tr>
                                    <th className="w-[6.25rem]">이름</th>
                                    <th className="w-[6.25rem]">직책</th>
                                    <th className="w-[6.25rem]">아이디</th>
                                    <th className="w-[12.5rem]">입사일</th>
                                    <th className="w-[12.5rem]">활성 여부</th>
                                    <th className="w-[12.5rem]">정보 조회</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {(users as any[])?.map((u, index) =>
                                    <tr key={index}>
                                        <td>{u?.name}</td>
                                        <td >{getRole(u?.role)}</td>
                                        <td>{u?.username}</td>
                                        <td>{getDateKorean(u?.joinDate)}</td>
                                        <td><button className="btn btn-xs" onClick={() => updateActiveUser(u?.username).then(r => {
                                            getDepartmentUsers(departmentUsers?.name).then(r => setDepartmentUsers(r)).catch(e => console.log(e));
                                            if (r.username == user.username)
                                                setUser(r);
                                        }).catch(e => console.log(e))}>{u?.active ? "비활성화" : '활성화'}</button></td>
                                        <td><button className="btn btn-xs" onClick={() => {
                                            setName(u?.name);
                                            setRole(u?.role)
                                            setPhoneNumber(u?.phoneNumber);
                                            setJoinDate(getDateFormatInput(u?.joinDate))
                                            setDepartmentId(u?.department?.name);
                                            setSelectUser(u);
                                        }}>열람 및 수정</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                }
                <div className="self-start mt-1">
                    <button className="btn btn-xs mr-2" onClick={() => {
                        setUsername('');
                        setName('');
                        setRole(12)
                        setPhoneNumber('');
                        setJoinDate(getDateFormatInput(new Date()))
                        setDepartmentId(departmentUsers?.name);
                        setAddPeople(true);
                    }}>계정 생성</button>
                    <button className="btn btn-xs" onClick={() => {
                        setSearchedUsers([]);
                        setUserLoadOpen(true);
                        if (searchInterval)
                            clearInterval(searchInterval);
                        searchUsers(keyword, 0).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); setPage(0); }).catch(e => console.log(e));
                    }}>인원 불러오기</button>
                </div>
                {departmentUsers?.child?.length > 0 ? detailFolds.includes(departmentUsers) ?
                    <button className="self-start btn btn-xs mt-2" onClick={() => { setDetailFold([...detailFolds.filter(f => f.name != departmentUsers?.name)]); }}>하위 그룹 닫기</button>
                    :
                    <button className="self-start btn btn-xs mt-2" onClick={() => { setDetailFold([...detailFolds, departmentUsers]); }}>하위 그룹 열기</button>
                    :
                    <></>
                }

            </div>
            {detailFolds.includes(departmentUsers) ? (departmentUsers?.child as any[])?.map((child, index) => <Detail key={index} departmentUsers={child} stack={stack} />) : <></>}
        </>
    }
    return <Main user={user} isClientLoading={isClientLoading}>
        <div className="w-4/12 flex items-center justify-center pt-10 pb-12">
            <div className="h-full w-11/12 bg-white shadow p-2 ">
                <div className="w-full h-30 flex justify-between gap-20 ">
                    <button className="btn btn-xs btn-error text-white font-bold" onClick={() => {
                        if (!departmentUsers || departmentUsers?.name != null)
                            getDepartmentUsers().then(r => { setDepartmentUsers(r); setSelect(null); }).catch(e => console.log(e));
                    }}>무소속 사용자</button>
                    <button className="btn btn-xs btn-warning text-white font-bold" onClick={() => {
                        setAddOpen(true);
                        setDepartmentId('');
                        setDepartmentName('');
                        setUrl('');
                    }}>부서 추가</button>
                </div>
                <div className="h-[94%] overflow-y-scroll mt-3">
                    {departmentList?.map((department, index) => <Department key={index} department={department} />)}
                </div>
            </div>
            <DropDown open={dropDown != null} onClose={() => setDropDown(null)} button={dropDown?.name} className="bg-white border-2 rounded-lg flex items-center justify-center" defaultDriection={Direcion.RIGHT} width={90} height={40}>
                <label className="text-red-500 font-bold hover:underline cursor-pointer" onClick={() => { if (confirm(dropDown?.name + '을 정말 삭제하시겠습니까? 하위 모든 부서도 같이 삭제됩니다.')) deleteDepartment(dropDown?.name).then(r => { setDepartmentList([...r]); setDropDown(null); setSelect(null); }).catch(e => { if (e.response && e.response.status == 403 && e.response.data.includes('부서')) alert(e.response.data); else console.log(e); }) }} >삭제</label>
            </DropDown>
        </div>
        <div className="w-8/12 flex items-center justify-center pt-10 pb-12">
            <div className="h-full w-11/12 bg-white shadow p-4 flex flex-col items-center overflow-y-scroll">
                <div className="mt-6 w-full">
                    {!select && !departmentUsers ? <label className="text-4xl font-bold">부서를 선택해주세요</label>
                        :
                        <Detail departmentUsers={departmentUsers} />
                    }
                </div>
                <Modal open={isUserLoadOpen} onClose={() => setUserLoadOpen(false)} escClose={true} outlineClose={true} className="w-[31.25rem] h-[31.25rem] flex flex-col items-center p-4">
                    <div className="flex border border-gray-500 rounded-full px-4 py-2 w-3/4 items-center">
                        <input id="searchInput" type="text" placeholder="이름 또는 부서명 검색" defaultValue={keyword} className="outline-none w-full" onChange={e => {
                            const keyword = e.target.value;
                            setKeyword(keyword);
                            if (searchInterval)
                                clearInterval(searchInterval);
                            const interval = setInterval(() => { searchUsers(keyword, 0).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); setPage(0); }).catch(e => console.log(e)); clearInterval(interval); }, 500);
                            setSearchInterval(interval);
                        }} onKeyDown={e => { if (e.key == "Enter") document.getElementById('searchUser')?.click(); }} />
                        {keyword ? <img src="/x.png" className="cursor-pointer w-[1rem] h-[1rem] hover:border rounded-full border-gray-400 mr-2" onClick={() => {
                            const keyword = '';
                            setKeyword(keyword);
                            (document.getElementById('searchInput') as HTMLInputElement).value = '';
                            if (searchInterval)
                                clearInterval(searchInterval);
                            searchUsers(keyword, 0).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); setPage(0); }).catch(e => console.log(e));
                        }} /> : <></>}
                        <img id="searchUser" src="/searchb.png" className="cursor-pointer w-[1rem] h-[1rem]" onClick={() => {
                            if (searchInterval)
                                clearInterval(searchInterval);
                            searchUsers(keyword, 0).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); setPage(0); }).catch(e => console.log(e));
                        }} />
                    </div>
                    <div className="divider divider-info my-1"></div>
                    <div className="flex flex-col w-full h-[18.75rem] overflow-y-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th className="w-[1rem]"></th>
                                    <th>이름</th>
                                    <th>소속 부서</th>
                                    <th>아이디</th>
                                    <th>입사일</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {searchedUsers?.map((u, index) => <tr key={index}>
                                    <td>
                                        <img src={u?.url ? u.url : '/base_profile.png'} className="w-[1rem] h-[1rem]" />
                                    </td>
                                    <td>
                                        {u?.name}
                                    </td>
                                    <td>
                                        {u?.department?.name}
                                    </td>
                                    <td>
                                        {u?.username}
                                    </td>
                                    <td className="text-right">
                                        {getDateKorean(u?.joinDate)}
                                    </td>
                                    <td>
                                        <button disabled={u?.department?.name == select?.name} className="btn btn-xs btn-warning text-white" onClick={() => {
                                            updateUser({ username: u?.username, name: u?.name, password: '', role: u?.role, phoneNumber: u?.phoneNumber, joinDate: null, department_id: select ? select.name : null })
                                                .then(r => {
                                                    getDepartmentUsers(departmentUsers?.name).then(r => setDepartmentUsers(r)).catch(e => console.log(e));
                                                    if (r.username == user.username)
                                                        setUser(r);
                                                }).catch(e => console.log(e))
                                            setUserLoadOpen(false);
                                        }}>불러오기</button>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-2 items-center">
                        <img src={page > 0 ? "/lleft.png" : '/lleftg.png'} className={"w-[1rem] h-[1rem]" + (page > 0 ? ' cursor-pointer hover:bg-gray-300 rounded-full' : '')} onClick={() => {
                            if (searchInterval)
                                clearInterval(searchInterval);
                            const now = Math.max(0, page - (page % 10) - 1);
                            setSearchedUsers([]);
                            setPage(now);
                            searchUsers(keyword, now).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); }).catch(e => console.log(e));
                        }} />
                        <img src={page > 0 ? "/left.png" : '/leftg.png'} className={"w-[1rem] h-[1rem]" + (page > 0 ? ' cursor-pointer hover:bg-gray-300 rounded-full' : '')} onClick={() => {
                            if (searchInterval)
                                clearInterval(searchInterval);
                            const now = Math.max(0, page - 1);
                            setSearchedUsers([]);
                            setPage(now);
                            searchUsers(keyword, now).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); }).catch(e => console.log(e));
                        }} />
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                            const now = page - page % 10 + n;
                            if (now >= maxPage)
                                return;
                            return <button key={n} disabled={now == page} className="btn btn-xs" onClick={() => {
                                if (searchInterval)
                                    clearInterval(searchInterval);
                                setSearchedUsers([]);
                                setPage(now);
                                searchUsers(keyword, now).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); }).catch(e => console.log(e));
                            }}>{now + 1}</button>;
                        })}
                        <img src={page < maxPage - 1 ? "/right.png" : '/rrightg.png'} className={"w-[1rem] h-[1rem]" + (page < maxPage - 1 ? ' cursor-pointer hover:bg-gray-300 rounded-full' : '')} onClick={() => {
                            if (searchInterval)
                                clearInterval(searchInterval);
                            const now = Math.min(maxPage - 1, page + 1);
                            setSearchedUsers([]);
                            setPage(now);
                            searchUsers(keyword, now).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); }).catch(e => console.log(e));
                        }} />
                        <img src={page < maxPage - 1 ? "/rright.png" : '/rightg.png'} className={"w-[1rem] h-[1rem]" + (page < maxPage - 1 ? ' cursor-pointer hover:bg-gray-300 rounded-full' : '')} onClick={() => {
                            if (searchInterval)
                                clearInterval(searchInterval);
                            const now = Math.min(maxPage - 1, (page - page % 10) + 10);
                            setSearchedUsers([]);
                            setPage(now);
                            searchUsers(keyword, now).then(r => { setSearchedUsers(r.content); setMaxPage(r?.totalPages); }).catch(e => console.log(e));
                        }} />
                    </div>
                    <div className="divider divider-info mt-0 mb-1"></div>

                    <button className="btn btn-error text-white">닫기</button>
                </Modal>
                <Modal open={selectUser || addPeople} onClose={() => { setSelectUser(null); setAddPeople(false); }} className="w-[31.25rem] min-h-[28.125rem] flex flex-col items-center" escClose={true} outlineClose={true}>
                    <div className="w-full h-[3.125rem] bg-[#8fbee9] text-white text-2xl flex items-center justify-center">
                        {addPeople ?
                            <label>신규 인원 추가</label>
                            :
                            <label><label className="font-bold">{selectUser?.username}</label>님의 개인정보</label>}
                    </div>
                    {addPeople ?
                        <div className="mt-2 flex items-center">
                            <label className="text-lg mr-2 w-[6.25rem]">아이디</label>
                            <input type="text" className="input input-info w-[18.75rem]" defaultValue={username} placeholder="아이디" onChange={e => setUsername(e.target.value)} />
                        </div>
                        : <></>}
                    <div className="mt-2 flex items-center">
                        <label className="text-lg mr-2 w-[6.25rem]">이름</label>
                        <input type="text" className="input input-info w-[18.75rem]" defaultValue={name} placeholder="이름" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mt-2 flex items-center">
                        <label className="text-lg mr-2 w-[6.25rem]">직책</label>
                        <select className="input input-info w-[18.75rem]" defaultValue={role} onChange={e => setRole(Number(e.target.value))}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => <option key={n} defaultValue={n} value={n}>{getRole(n)}</option>)}
                        </select>
                    </div>
                    <div className="mt-2 flex items-center">
                        <label className="text-lg mr-2 w-[6.25rem]">비밀번호</label>
                        <input type="password" className="input input-info w-[18.75rem]" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="mt-2 flex items-center">
                        <label className="text-lg mr-2 w-[6.25rem]">전화번호</label>
                        <input type="text" className="input input-info w-[18.75rem]" defaultValue={phoneNumber ? PhoneNumberCheck(phoneNumber) : "010-"} placeholder="전화번호" onChange={e => { const value = PhoneNumberCheck(e.target.value); e.target.value = value; setPhoneNumber(value.replaceAll('-', '')) }} />
                    </div>
                    <div className="mt-2 flex items-center">
                        <label className="text-lg mr-2 w-[6.25rem]">입사일</label>
                        <input type="date" className="input input-info w-[18.75rem]" defaultValue={joinDate} placeholder="입사일" onChange={e => setJoinDate(e.target.value)} />
                    </div>
                    <div className="mt-2 flex items-center">
                        <label className="text-lg mr-2 w-[6.25rem]">부서</label>
                        <div className="input input-info w-[18.75rem] flex items-center justify-between">
                            <label>{departmentId}</label>
                            <button className="btn btn-xs" onClick={() => { setSelectFold([]); setOpenDepartment(true); }}>부서변경</button>
                        </div>

                    </div>
                    <div className="my-auto py-5">
                        {addPeople ?
                            <button className="btn btn-xs btn-info text-white mr-2" onClick={() => {
                                if (username) {
                                    postUser({ username: username, name: name, password: password, role: role, phoneNumber: phoneNumber, joinDate: joinDate + "T00:00", department_id: departmentId })
                                        .then(r => {
                                            getDepartmentUsers(departmentUsers?.name).then(r => setDepartmentUsers(r)).catch(e => console.log(e));
                                            if (r.username == user.username)
                                                setUser(r);
                                        }).catch(e => console.log(e))
                                    setAddPeople(false);
                                } else
                                    alert('아이디가 비어있습니다.');
                            }}>등록하기</button>
                            :
                            <button className="btn btn-xs btn-info text-white mr-2" onClick={() => {
                                updateUser({ username: selectUser?.username, name: name, password: password, role: role, phoneNumber: phoneNumber, joinDate: joinDate + "T00:00", department_id: departmentId })
                                    .then(r => {
                                        getDepartmentUsers(departmentUsers?.name).then(r => setDepartmentUsers(r)).catch(e => console.log(e));
                                        if (r.username == user.username)
                                            setUser(r);
                                    }).catch(e => console.log(e))
                                setSelectUser(null);
                            }}>변경하기</button>
                        }
                        <button className="btn btn-xs btn-error text-white" onClick={() => { setSelectUser(null); setAddPeople(false) }}>취소</button>
                    </div>
                </Modal>
                <Modal open={openDepartment} onClose={() => setOpenDepartment(false)} escClose={true} outlineClose={true} className="w-[18.75rem] h-[18.75rem] flex flex-col p-4" outlineClassName="z-[5]">
                    <div className="overflow-y-scroll">
                        {departmentList?.map((department, index) => <SelectDepartment key={index} department={department} />)}
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button className="btn btn-xs btn-warning text-white mr-2" onClick={() => { setDepartmentId(''); setOpenDepartment(false) }}>무소속</button>
                        <button className="btn btn-xs btn-error text-white" onClick={() => setOpenDepartment(false)}>취소</button>
                    </div>
                </Modal>
                <Modal open={addOpen} onClose={() => setAddOpen(false)} escClose={true} outlineClose={true} className="w-[31.25rem] h-[37.5rem] flex flex-col">
                    <div className="w-full h-[3.125rem] bg-[#8fbee9] text-white font-bold flex p-2 text-2xl">부서 추가</div>
                    <div className="flex flex-col p-4">
                        <div className="flex items-center mb-4">
                            <label className="min-w-[6.25rem] w-[6.25rem] text-center font-bold">부서명</label>
                            <input className="w-full input input-bordered" type="text" placeholder="부서명" onChange={(e) => setDepartmentName(e.target.value)} autoFocus={addOpen} />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="min-w-[12.5rem] w-[12.5rem] flex">
                                <label className="min-w-[6.25rem] w-[6.25rem] text-center font-bold">상위 부서</label>
                                <label className="min-w-[6.25rem] w-[6.25rem] mr-1">{departmentId ? departmentId : '최상위'}</label>
                            </div>
                            <div className="flex items-center">
                                <button className="btn btn-xs btn-info text-white mr-1" onClick={() => { setSelectFold([]); setOpenDepartment(true); }}>부서변경</button>
                                <button className="btn btn-xs btn-error text-white" onClick={() => setDepartmentId('')}>초기화</button>
                            </div>
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="min-w-[6.25rem] w-[6.25rem] text-center font-bold">부서권한</label>
                            <select defaultValue={0} onChange={(e) => setDepartmentRole(Number(e.target.value))}>
                                {[0, 1].map(n => <option key={n} value={n}>{getDepartmentRole(n)}</option>)}
                            </select>
                        </div>
                        <div className="flex relative self-center">
                            <div className="hover:bg-gray-300 absolute w-[18.75rem] h-[18.75rem] opacity-50 cursor-pointer" onClick={() => document.getElementById('file')?.click()}></div>
                            <input id="file" type="file" hidden onChange={e => {
                                if (e.target.files) {
                                    const formData = new FormData();
                                    formData.append('file', e.target.files[0]);
                                    postDepartmentImage(formData).then(r => setUrl(r)).catch(e => console.log(e));
                                }
                            }} />
                            <img src={url ? url : '/white.png'} className="w-[18.75rem] h-[18.75rem] border-2 border-black" alt="부서 이미지" />
                        </div>
                        <div className="self-center mt-6">
                            <button className="btn btn-info btn-xs mr-2 text-white" onClick={() => {
                                setAddOpen(false);
                                postDepartment({ url: url, name: departmentName, parentId: departmentId, role: departmentRole }).then(r => { setDepartmentList(r); }).catch(e => console.log(e));
                            }}>등록</button>
                            <button className="btn btn-error btn-xs text-white" onClick={() => setAddOpen(false)}>취소</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    </Main>
}

