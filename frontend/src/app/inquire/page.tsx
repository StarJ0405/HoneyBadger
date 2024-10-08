"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDateTimeKorean } from "../Global/Method";
import { checkQuestion, createQuestion, getQuestions, getUser, updateQuestionAnswer } from "../API/UserAPI";
import Modal from "../Global/Modal";
import '../quill.bubble.css';
import ReactQuill from "react-quill";
import QuillNoSSRWrapper from "../Global/QuillNoSSRWrapper";


export default function Home() {
    const [isClientLoading, setClientLoading] = useState(true);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [questions, setQuetions] = useState([] as any[]);
    const [page, setPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [searchInterval, setSearchInterval] = useState(null as any);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [password, setPassword] = useState('');
    const [lock, setLock] = useState(false);
    const [error, setError] = useState('');
    const quillInstance = useRef<ReactQuill>(null);
    const [isAdmin, setAdmin] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const modules = useMemo(
        () => ({
            toolbar: {
                container: []
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [],
    );
    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    if (r.role == 13 || r.department?.role == 1) {
                        setAdmin(true);
                        const interval = setInterval(() => { setClientLoading(false); clearInterval(interval); }, 1000);
                    } else
                        location.href = '/cycle';
                })
                .catch(e => {
                    const interval = setInterval(() => { setClientLoading(false); clearInterval(interval); }, 1000);
                    console.log(e);
                });
        else {
            const interval = setInterval(() => { setClientLoading(false); clearInterval(interval); }, 1000);
        }
    }, [ACCESS_TOKEN])

    useEffect(() => {
        if (page >= 0)
            getQuestions(page, keyword).then(r => { setLoading(false); setQuetions([...questions, ...r?.content]); setMaxPage(r?.totalPages) }).catch(e => console.log(e));
        else
            setPage(0);
    }, [page])
    useEffect(() => {
        setQuetions([]);
        setPage(-1);
    }, [keyword]);

    function Question(props: { question: any }) {
        const question = props.question;
        const [fold, setFold] = useState(true);
        const [isChecked, setCheck] = useState(isAdmin || !question?.lock);
        const [error, setError] = useState('');
        const [answer, setAnswer] = useState('');
        return <div className="w-full flex flex-col mb-2 border-y-2 border-black" >
            <div className="w-full h-[2.5rem] flex justify-between items-center rounded-lg hover:bg-gray-200 p-4 cursor-pointer" onClick={() => setFold(!fold)}>
                <div className="flex items-center">
                    <img hidden={!question?.lock} src="/lock.png" className="w-[1.5rem] h-[1.5rem]" />
                    <label className="cursor-pointer">{!question?.lock || isChecked ? question?.title : "비밀글입니다."}</label>
                </div>
                <div className="flex flex-col items-end justify-bewteen">
                    <label className="mr-2 cursor-pointer">{question?.author}</label>
                    <label className="text-xs font-bold cursor-pointer">{getDateTimeKorean(question?.createDate)}</label>
                </div>
            </div>
            {fold ? <></> :
                <>
                    {
                        isChecked ?
                            <div className={"flex flex-col p-4"}>
                                <div dangerouslySetInnerHTML={{ __html: question?.content }}></div>
                            </div>
                            :
                            <div className={"flex justify-end p-4"}>
                                <label className="text-red-500 text-xs">{error}</label>
                                <input id={question?.id + "pw"} type="password" className="w-[12.5rem] input-xs mr-2" placeholder="비밀번호 확인" onKeyDown={e => {
                                    if (e.key == "Enter") document.getElementById(question?.id + 'check')?.click()
                                }} />
                                <button id={question?.id + "check"} className="btn btn-xs btn-info text-white" onClick={() => {
                                    const value = (document.getElementById(question?.id + 'pw') as HTMLInputElement).value;
                                    if (value)
                                        checkQuestion({ password: value, id: question?.id }).then(r => { setCheck(r); if (!r) setError('비밀번호가 일치하지 않습니다.') }).catch(e => console.log(e));
                                    else
                                        setError('비밀번호를 입력해주세요.');
                                }}>확인</button>
                            </div>
                    }
                    <div className="flex flex-col p-4">
                        {isAdmin || isChecked ?
                            question?.answer ?
                                <div className="flex flex-col">
                                    <label className="text-lg font-bold text-sm">답변</label>
                                    <div className="border-2 border-gray-300 rounded-lg p-4 flex flex-col">
                                        <div dangerouslySetInnerHTML={{ __html: question?.answer }}></div>
                                        <label className="text-xs self-end">{getDateTimeKorean(question?.modifyDate)}</label>
                                    </div>
                                </div>
                                :
                                isAdmin ?
                                    <div className="flex flex-col">
                                        <label className="text-lg font-bold text-sm">답변</label>
                                        <QuillNoSSRWrapper
                                            forwardedRef={quillInstance}
                                            value={answer}
                                            onChange={(e: any) => setAnswer(e)}
                                            modules={modules}
                                            theme="bubble"
                                            className='w-full h-[6rem] border-2 border-gray-300 rounded-lg'
                                            placeholder="답변 내용을 입력해주세요."
                                        />
                                        <button className="btn btn-xs btn-success text-white mt-1" onClick={() => {
                                            updateQuestionAnswer({ answer: answer, id: question?.id }).then(r => {
                                                const index = questions.findIndex(f => f.id == r?.id)
                                                questions[index] = r;
                                                setQuetions([...questions]);
                                            }).catch(e => console.log(e));
                                        }}>등록</button>
                                    </div>
                                    : <></>
                            : <></>
                        }

                    </div>
                </>
            }
        </div>
    }

    return <main className="flex justify-center items-center flex-col h-full w-full">
        <div className={"absolute text-8xl font-bold flex flex-col items-center justify-center h-full w-full bg-white z-[1000]" + (isClientLoading ? '' : ' hidden')}>
            <img src="/logo.png" />
        </div>
        <Modal open={open} onClose={() => setOpen(false)} escClose={true} outlineClose={true} className="flex flex-col w-[31.5rem] min-h-[28rem] items-center p-4">
            <label className="text-red-500 font-bold mb-1 h-[1.5rem]">{error}</label>
            <div className="flex input input-bordered items-center w-full mb-4">
                <label className="min-w-[5rem] mr-2">제목</label>
                <input className="w-full" type="text" placeholder="제목" onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="flex input input-bordered items-center w-full h-[12.5rem] mb-4">
                <label className="min-w-[5rem] mr-2">내용</label>
                <QuillNoSSRWrapper
                    forwardedRef={quillInstance}
                    value={content}
                    onChange={(e: any) => setContent(e)}
                    modules={modules}
                    theme="bubble"
                    className='w-[23rem] h-[12.5rem]'
                    placeholder="내용을 입력해주세요."
                />
            </div>
            <div className="flex input input-bordered items-center w-full mb-4">
                <label className="min-w-[5rem] mr-2">저자</label>
                <input className="w-full" type="text" placeholder="저자" onChange={e => setAuthor(e.target.value)} />
            </div>
            <div className="flex self-start text-xs mb-2">
                <label>비밀글</label>
                <input type="checkbox" onChange={e => setLock(e.target.checked)} />
            </div>
            {lock ?
                <div className="flex input input-bordered items-center w-full mb-4">
                    <label className="min-w-[5rem] mr-2">비밀번호</label>
                    <div className="flex flex-col w-full">
                        <input className="w-full" type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} />
                    </div>
                </div>
                : <></>}
            <div>
                <button className="btn btn-sm btn-info text-white mr-2" onClick={() => {
                    if (title && content && author && (!lock || password)) {
                        setOpen(false);
                        createQuestion({ title: title, content: content, author: author, password: password, lock: lock }).then(() => {
                            setQuetions([]);
                            setPage(-1);
                        }).catch(e => console.log(e));
                    } else
                        setError('문의에 필요한 모든 내용을 작성해주세요.');
                }}>등록</button>
                <button className="btn btn-sm btn-error text-white" onClick={() => setOpen(false)}>취소</button>
            </div>


        </Modal>
        <div className="w-[55rem] flex flex-col items-center">
            <label className="font-bold text-4xl mb-4">문의 내용</label>
            <div className="flex items-end justify-center w-full relative mb-2">
                <div className="w-[37.5rem] flex border-2 border-black py-2 px-4 rounded-full mt-2">
                    <input id="search" type="text" className="outline-none w-full" autoFocus onKeyDown={e => {
                        if (e.key == "Enter") document.getElementById('searchButton')?.click()
                    }} onChange={e => {
                        if (searchInterval) clearInterval(searchInterval);
                        const interval = setInterval(() => { setKeyword(e.target.value); clearInterval(interval); }, 1500);
                        setSearchInterval(interval);
                    }} />
                    <img id="searchButton" src="/searchb.png" className="w-[1.5rem] h-[1.5rem] cursor-pointer" onClick={() => {
                        if (searchInterval) clearInterval(searchInterval);
                        setSearchInterval(null);
                        setKeyword((document.getElementById('search') as HTMLInputElement)?.value);
                    }} />
                </div>
                {isAdmin ? <></> :
                    <button className="absolute right-0 btn btn-xs btn-warning font-bold text-white" onClick={() => {
                        setOpen(true);
                        setTitle('');
                        setContent('');
                        setAuthor('');
                        setPassword('');
                        setLock(false);
                        setError('');
                    }}>문의 작성</button>}

            </div>

            <div className="w-[55rem] h-[32rem] flex flex-col py-4 px-2 border-2 rounded-lg border-black">

                <div className="h-full overflow-y-scroll flex flex-col" onScroll={e => {
                    const element = e.target as HTMLElement;

                    if (!isLoading && page < maxPage && element.scrollHeight - element.clientHeight == element.scrollTop) {
                        setLoading(true);
                        setPage(page + 1);
                    }
                }}>
                    {questions.map((question, index) => <Question key={index} question={question} />)}
                </div>
            </div>
            <button className="self-end btn btn-xs btn-error text-white mt-1" onClick={() => location.href = isAdmin ? '/cycle' : "/"}>돌아가기</button>
        </div>
    </main>
}