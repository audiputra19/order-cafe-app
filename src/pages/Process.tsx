import moment from "moment";
import { useEffect, useState, type FC } from "react";
import { FaCircle } from "react-icons/fa6";
import { MdOutlineArrowBack } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ModalCancel } from "../components/ModalCancel";
import { apiOrder, useFinishOrderMutation, useGetOrderByIdQuery, useGetOrderItemsQuery, useGetTimeProcessByIdQuery } from "../services/apiOrder";
import { socket } from "../socket";

const Process: FC = () => {
  const { orderID = "" } = useParams<{ orderID: string }>();
  // console.log("order id: ", orderID);
  const navigate = useNavigate();
  const { data: getOrder, isLoading: isLoadingOrder } = useGetOrderByIdQuery(orderID, {
    skip: !orderID,
    refetchOnMountOrArgChange: true,
  });
  const { data: getOrderItems = [], isLoading: isLoadingOrderItems } = useGetOrderItemsQuery(orderID, {
    skip: !orderID,
    refetchOnMountOrArgChange: true,
  });
  const { data: getTimeProcess, isLoading: isLoadingTimeProcess } = useGetTimeProcessByIdQuery(orderID, {
    skip: !orderID,
    refetchOnMountOrArgChange: true,
  });
  const [finish, {isLoading: isLoadingFinish}] = useFinishOrderMutation();
  // const [email, setEmail] = useState("");
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [agreeToCancel, setAgreeToCancel] = useState(false);
  const dispatch = useDispatch();
  let totalAll = 0;

  const baseSteps = [
    {
      name: "pending",
      label: "Pembayaran berhasil", 
      desc: "Menunggu bagian kasir melanjutkan proses",
    },
    {
      name: "acc kasir",
      label: "Pesanan diproses",
      desc: "Menunggu bagian dapur melanjutkan proses",
    },
    {
      name: "acc dapur",
      label: "Pesanan dibuat",
      desc: "Mohon ditunggu",
    },
    {
      name: "ready",
      label: "Pesanan siap",
      desc: "Silahkan ambil diarea pengambilan",
    }
    ,
    {
      name: "done",
      label: "Pesanan selesai",
      desc: "Terima kasih, silahkan klik pesanan selesai dibawah",
    },
  ] as const;

  const waitingStep = {
    name: "waiting",
    label: "Menunggu pembayaran",
    desc: "Silahkan lakukan pembayaran ke kasir",
  };

  const steps = getOrder?.metode === "transfer" ? baseSteps : [waitingStep, ...baseSteps];

  useEffect(() => {
    if(agreeToCancel){
      navigate('/')
    }
  },[agreeToCancel])

  useEffect(() => {
    const onUpdate = (data: any) => {
      dispatch(apiOrder.util.invalidateTags(["Order"]));

      if (data.order_id === orderID && data.proses === "ready") {
        navigate("/alarm");
      }
    };

    const onCancel = (data: any) => {
      if (data.order_id === orderID) {
        setShowModalCancel(true);
        dispatch(apiOrder.util.invalidateTags(["Order"]));
      }
    };

    socket.on("order:update", onUpdate);
    socket.on("order:cancel", onCancel);

    return () => {
      socket.off("order:update", onUpdate);
      socket.off("order:cancel", onCancel);
    };
  }, [orderID]);

  const handleFinish = async (order_id: string) => {
    await finish({ order_id });
    dispatch(apiOrder.util.invalidateTags(["Order"]));
  };

  const renderTime = (name: string) => {
    const formatTime = (date?: string | null) => {
      if (!date) return null; // kalau belum ada datanya
      return (
        <>
          <p className="text-xs text-gray-400">{moment(date).format("DD MMM")}</p>
          <p className="text-xs text-gray-400">{moment(date).format("HH:mm")}</p>
        </>
      );
    };

    switch (name) {
      case "pending":
        return <div>{formatTime(getTimeProcess?.paid)}</div>;
      case "acc kasir":
        return <div>{formatTime(getTimeProcess?.acc_kasir)}</div>;
      case "acc dapur":
        return <div>{formatTime(getTimeProcess?.acc_dapur)}</div>;
      case "ready":
        return <div>{formatTime(getTimeProcess?.ready)}</div>;
      case "done":
        return <div>{formatTime(getTimeProcess?.done)}</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="sm:flex sm:justify-center">
        <div className="sm:w-[400px] bg-main min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center p-3 cursor-pointer">
            <div
              className="bg-card2 p-2 rounded-full"
              onClick={() => navigate("/transaction")}
            >
              <MdOutlineArrowBack size={25} />
            </div>
            <p className="text-lg font-bold px-5 py-1 bg-card2 rounded-full">
              Proses
            </p>
            <div className="text-main p-2 rounded-full bg-main">
              <MdOutlineArrowBack size={25} />
            </div>
          </div>
          
          {/* Loading Screen */}
          {(isLoadingOrder || isLoadingOrderItems || isLoadingFinish || isLoadingTimeProcess) ? (
            <div className="flex flex-col gap-5 bg-main min-h-screen px-10 py-5 animate-pulse">
              <div className="w-full bg-card2 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main w-20"></p>
                  <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main w-32"></p>
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                      className="w-full bg-card2 rounded-xl p-3"
                      key={i}
                  >
                    <div className="flex justify-between items-center gap-3">
                        <p className="font-semibold line-clamp-1 h-5 rounded-full bg-main w-10 h-10"></p>
                        <div className="flex flex-col gap-2 flex-1">
                          <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main w-25"></p>
                          <p className="font-semibold line-clamp-1 h-5 rounded-xl bg-main w-full"></p>
                        </div>
                    </div>
                  </div>
              ))}
            </div> 
          ) : (
            <>
              {/* Steps */}
              <div className="relative flex flex-col px-5 py-2 mb-5">
                  {steps.map((step, index) => {
                      const currentStepName = (() => {
                        if (!getOrder) return "waiting";

                        if (getOrder.metode === "transfer") {
                          return getOrder.proses || "pending";
                        }

                        if (getOrder.status !== "paid") return "waiting";

                        return getOrder.proses || "pending";
                      })();

                      const currentStepIndex = steps.findIndex((s) => s.name === currentStepName);
                      const isCompleted = index < currentStepIndex;
                      const isActive = index === currentStepIndex;

                      // const icon =
                      //     step.name === "waiting" ? (
                      //       <LuInfo size={18} />
                      //     ) : step.name === "pending" ? (
                      //       <FaMoneyBillTransfer />
                      //     ) : step.name === "acc kasir" ? (
                      //       <RiProgress3Line size={18}/>
                      //     ) : step.name === "acc dapur" ? (
                      //       <PiChefHat size={18} />
                      //     ) : step.name === "ready" ? (
                      //       <IoFastFoodOutline size={18} />
                      //     ) : (
                      //       <LuClipboardCheck size={18}/>
                      //     )

                      return (
                          <div key={step.name} className="grid grid-cols-[32px_1fr] items-center gap-5 relative min-h-19">
                              {/* Circle + line */}
                              <div className="flex flex-col items-center relative">
                                  <span
                                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 transition-all duration-300 ${
                                      isCompleted || (isActive && step.name === "done")
                                      ? "bg-primary text-white ring-main"
                                      : isActive
                                      ? "border-2 border-primary bg-main text-primary ring-green-200"
                                      : "border-2 border-gray-200 bg-main ring-main text-gray-300"
                                  }`}
                                  >
                                  {isCompleted || (isActive && step.name === "done") 
                                  ? <FaCircle size={12} /> 
                                  : <FaCircle size={12} />}
                                  {isActive && step.name !== "done" && (
                                      <span className="absolute h-8 w-8 rounded-full border-2 border-primary animate-ping" />
                                  )}
                                  </span>

                                  {/* connector line */}
                                  {index < steps.length - 1 && (
                                  <span
                                      className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-[46px] ${
                                      isCompleted ? "bg-primary" : "bg-gray-300"
                                      }`}
                                  />
                                  )}
                              </div>

                              {/* Text */}
                              <div className="flex justify-between items-center gap-5">
                                <div>
                                    <p
                                      className="font-medium capitalize"
                                    >
                                      {step.label}
                                    </p>
                                    <p className="text-xs text-gray-400">{step.desc}</p>
                                </div>
                                <div className="text-right flex flex-col min-w-[50px]">
                                  {renderTime(step.name)}
                                </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
              <div className="px-3 pb-3">
                  <div className="border border-card bg-card2 rounded-xl">
                      <div className="mb-5 py-3 px-5 border-b border-card">
                          <p className="text-lg font-semibold">Detail Pembelian</p>
                      </div>
                      <div className="mb-5 mx-5 pb-5 flex flex-col gap-3 border-b border-gray-300">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-400">ID Order</span>  
                          <span className="ml-2 font-semibold">{getOrder?.order_id}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-400">Tanggal</span>  
                          <span className="ml-2 font-semibold">
                            {moment(getOrder?.created_at).locale("id").format("DD MMM YYYY")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-400">Pembayaran</span>  
                          <span className="ml-2 font-semibold">{getOrder?.metode}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 px-5 mb-5">
                          <div className="border-b border-gray-300 pb-4 flex flex-col gap-3">
                            {getOrderItems.map((item, i) => {
                                const total = item.harga * item.qty;
                                totalAll += total;

                                return (
                                    <div key={i} className="flex justify-between items-center">
                                        <div
                                            className="text-sm max-w-[230px]"
                                        >
                                            <span className="text-gray-400">
                                              <span>{item.nama} </span>
                                              {item.tipe && (
                                                <span>({item.tipe})</span> 
                                              )}
                                              <span>({Number(item.harga).toLocaleString("id-ID")})</span>
                                            </span>
                                            <span className="ml-1 text-primary font-semibold">{`x${item.qty}`}</span>
                                        </div>
                                        <div className="text-sm">{total.toLocaleString("id-ID")}</div>
                                    </div>
                                )
                            })}
                            {getOrder?.voucher && (
                              <div className="flex justify-between items-center">
                                  <div
                                      className="text-gray-400 text-sm max-w-[230px]"
                                  >
                                      Voucher {getOrder.voucher} ({getOrder.diskon}%)
                                  </div>
                                  <div className="text-sm text-red-500">
                                    -{((totalAll * getOrder.diskon) / 100).toLocaleString("id-ID")}
                                  </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-3">
                              <div className="text-gray-400 text-base font-semibold">
                                  Total
                              </div>
                              <div className="text-base text-primary font-semibold">{getOrder?.total.toLocaleString("id-ID")}</div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-col gap-3">
                      {/* Input email */}
                      {/* <div>
                        <input
                          type="text"
                          className={`w-full py-2 px-3 text-sm placeholder-gray-400 border border-card bg-card2 rounded-xl transition
                            ${getOrder?.proses !== 'ready' ? 'outline-none opacity-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-primary opacity-100'}
                          `}
                          placeholder="Masukkan email kamu"
                          readOnly={getOrder?.proses !== 'ready'}
                        />
                        <div className="flex gap-1 items-center ml-2 mt-2 text-gray-400 text-xs">
                          <p>Masukkan email untuk print out total pembelian</p>
                        </div>
                      </div> */}

                      {/* Tombol Pesanan Selesai */}
                      <button
                        className={`bg-green-500 p-3 rounded-xl text-white font-semibold transition
                          ${getOrder?.proses !== 'ready' ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-green-600 cursor-pointer'}
                        `}
                        disabled={getOrder?.proses !== 'ready'}
                        onClick={() => getOrder?.proses === 'ready' && handleFinish(orderID)}
                      >
                        Pesanan Selesai
                      </button>
                    </div>
                  </div>
              </div>
            </>
          )}
        </div>
      </div>
      {showModalCancel && <ModalCancel onClose={setAgreeToCancel} />}
    </>
  );
};

export default Process;