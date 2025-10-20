import { useEffect, useState, type FC } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";
import { LuCheckCheck, LuClipboardCheck, LuInfo } from "react-icons/lu";
import { MdOutlineArrowBack } from "react-icons/md";
import { PiChefHat } from "react-icons/pi";
import { RiProgress3Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { ModalCancel } from "../components/ModalCancel";
import { apiOrder, useFinishOrderMutation, useGetOrderByIdQuery, useGetOrderItemsQuery } from "../services/apiOrder";
import { socket } from "../socket";
import { useDispatch } from "react-redux";

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
      desc: "Pesanan sudah dibayar, menunggu bagian kasir melanjutkan proses",
    },
    {
      name: "acc kasir",
      label: "Pesanan diproses",
      desc: "Pesanan sudah diproses kasir, menunggu bagian dapur melanjutkan proses",
    },
    {
      name: "acc dapur",
      label: "Pesanan sedang dibuat",
      desc: "Pesanan sedang dibuat, mohon ditunggu",
    },
    {
      name: "ready",
      label: "Pesanan siap",
      desc: "Pesanan sudah siap, silahkan ambil diarea pengambilan",
    }
    ,
    {
      name: "done",
      label: "Pesanan selesai",
      desc: "Pesanan sudah selesai",
    },
  ] as const;

  const waitingStep = {
    name: "waiting",
    label: "Menunggu pembayaran",
    desc: "Pesanan sudah dibuat, silahkan lakukan pembayaran ke kasir",
  };

  const steps = getOrder?.status === "paid" ? baseSteps : [waitingStep, ...baseSteps];

  useEffect(() => {
    if(agreeToCancel){
      navigate('/')
    }
  },[agreeToCancel])

  useEffect(() => {
    const onUpdate = () => {
      dispatch(apiOrder.util.invalidateTags(["Order"]));
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
              Process
            </p>
            <div className="text-main p-2 rounded-full bg-main">
              <MdOutlineArrowBack size={25} />
            </div>
          </div>
          
          {/* Loading Screen */}
          {(isLoadingOrder || isLoadingOrderItems || isLoadingFinish) ? (
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
              <div className="relative flex flex-col px-10 py-5">
                  <div className="pb-5 flex justify-between items-center">
                      <div className="py-1 px-3 bg-main border border-primary text-primary rounded w-fit text-sm">
                          Meja no : 
                          <span className="ml-2 font-semibold">{getOrder?.meja}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-400">{getOrder?.order_id}</p>
                  </div>
                  {steps.map((step, index) => {
                      const currentStepName =
                        getOrder?.status !== "paid" ? "waiting" : getOrder?.proses;

                      const currentStepIndex = steps.findIndex((s) => s.name === currentStepName);
                      const isCompleted = index < currentStepIndex;
                      const isActive = index === currentStepIndex;

                      const icon =
                          step.name === "waiting" ? (
                            <LuInfo size={18} />
                          ) : step.name === "pending" ? (
                            <FaMoneyBillTransfer />
                          ) : step.name === "acc kasir" ? (
                            <RiProgress3Line size={18}/>
                          ) : step.name === "acc dapur" ? (
                            <PiChefHat size={18} />
                          ) : step.name === "ready" ? (
                            <IoFastFoodOutline size={18} />
                          ) : (
                            <LuClipboardCheck size={18}/>
                          )

                      return (
                          <div key={step.name} className="grid grid-cols-[32px_1fr] items-center gap-4 relative min-h-20">
                              {/* Circle + line */}
                              <div className="flex flex-col items-center relative">
                                  <span
                                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 transition-all duration-300 ${
                                      isCompleted || (isActive && step.name === "done")
                                      ? "bg-primary text-white ring-green-200"
                                      : isActive
                                      ? "border-2 border-primary bg-white text-primary ring-green-200"
                                      : "bg-gray-300 ring-gray-200 text-black"
                                  }`}
                                  >
                                  {isCompleted || (isActive && step.name === "done") ? <LuCheckCheck size={20} /> : icon}
                                  {isActive && step.name !== "done" && (
                                      <span className="absolute h-8 w-8 rounded-full border-2 border-primary animate-ping" />
                                  )}
                                  </span>

                                  {/* connector line */}
                                  {index < steps.length - 1 && (
                                  <span
                                      className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-[32px] ${
                                      isCompleted ? "bg-primary" : "bg-gray-300"
                                      }`}
                                  />
                                  )}
                              </div>

                              {/* Text */}
                              <div>
                                  <p
                                  className={`font-medium capitalize ${
                                      isCompleted || isActive ? "text-primary" : ""
                                  }`}
                                  >
                                  {step.label}
                                  </p>
                                  <p className="text-xs text-gray-400">{step.desc}</p>
                              </div>
                          </div>
                      );
                  })}
              </div>
              <div className="px-5 pb-5">
                  <div className="border border-card bg-card2 p-5 rounded-xl">
                      <div className="mb-3">
                          <p className="text-lg font-semibold">Detail Pembelian</p>
                      </div>
                      <div className="flex flex-col gap-1">
                          {getOrderItems.map((item, i) => {
                              const total = item.harga * item.qty;
                              totalAll += total;

                              return (
                                  <div key={i} className="flex justify-between items-center">
                                      <div
                                          className="text-gray-400 text-sm max-w-[230px]"
                                      >
                                          {item.nama} ({Number(item.harga).toLocaleString("id-ID")})
                                          <span className="ml-1 text-primary">{`+${item.qty}`}</span>
                                      </div>
                                      <div className="text-sm">{total.toLocaleString("id-ID")}</div>
                                  </div>
                              )
                          })}
                          <div className="flex justify-between items-center mt-2">
                              <div className="text-gray-400 text-base font-semibold">
                                  Total
                              </div>
                              <div className="text-base text-primary font-semibold">{totalAll.toLocaleString("id-ID")}</div>
                          </div>
                      </div>
                  </div>

                  {/* Muncul jika proses sudah 'ready' */}
                  {getOrder?.proses === 'ready' && (
                    <div className="mt-5">
                      <div className="flex flex-col gap-3">
                        {/* <div>
                          <input
                              type="text"
                              className="w-full focus:outline-none focus:outline-2 py-2 px-3 text-sm placeholder-gray-400 border border-card bg-card2 rounded-xl"
                              placeholder="Masukan email kamu"
                              onChange={(e) => setEmail(e.target.value)}
                          />
                          <div className="flex gap-1 items-center ml-2 mt-2 text-red-500">
                            <LuInfo />
                            <p className="text-xs">Masukan email untuk print out total pembelian</p>
                          </div>
                        </div> */}
                        <button 
                          className="bg-green-500 p-3 rounded-xl text-white font-semibold cursor-pointer"
                          onClick={() => handleFinish(orderID)}
                        >
                          Pesanan Selesai
                        </button>
                      </div>
                    </div>
                  )}
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