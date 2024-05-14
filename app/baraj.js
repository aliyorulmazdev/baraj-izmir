"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";

const BarajListesi = ({ barajlar, handleClick }) => (
  <ul className="divide-y divide-gray-200">
    {barajlar.map((baraj) => (
      <li
        key={baraj.BarajKuyuId}
        onClick={() => handleClick(baraj)}
        className="px-2 py-2 flex items-center justify-between text-sm leading-5 text-gray-900 cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
      >
        <div>{baraj.BarajKuyuAdi}</div>
        <div>{baraj.DolulukOrani}%</div>
      </li>
    ))}
  </ul>
);

const BarajDetay = ({ baraj }) => {
  const { speak } = useSpeechSynthesis();

  // Convert values to cubic hectometers
  const convertToHM3 = (value) => {
    return (value / 1000000).toFixed(2); // Convert from cubic meters to cubic hectometers
  };

  // Function to read details aloud
  const readDetailsAloud = () => {
    const details = `Tahtalı Barajı. Su Durumu ${convertToHM3(baraj.SuDurumu)} hm³. Su Yüksekliği ${baraj.SuYuksekligi} m. Kullanılabilir Gölsü Hacmi ${convertToHM3(baraj.KullanılabilirGolSuHacmi)} hm³. Tüketilebilir Su Kapasitesi ${convertToHM3(baraj.TuketilebilirSuKapasitesi)} hm³. Maksimum Su Kapasitesi ${convertToHM3(baraj.MaksimumSuKapasitesi)} hm³. Minimum Su Yüksekliği ${baraj.MinimumSuYuksekligi} m. Doluluk Oranı ${baraj.DolulukOrani}%. Durum Tarihi ${new Date(baraj.DurumTarihi).toLocaleDateString()}. Minimum Su Kapasitesi ${convertToHM3(baraj.MinimumSuKapasitesi)} hm³. Maksimum Su Yüksekliği ${baraj.MaksimumSuYuksekligi} m.`;
    speak({ text: details, lang: "tr-TR" });
  };

  const searchOnWikipedia = (keyword) => {
    const formattedKeyword = keyword.replace(" Kutlu Aktaş", "");
    window.open(`https://tr.wikipedia.org/wiki/${formattedKeyword}`, "_blank");
  };


  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">{baraj.BarajKuyuAdi}</h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">Su Durumu:</span>{" "}
            {convertToHM3(baraj.SuDurumu)} hm³
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Su Yüksekliği:</span>{" "}
            {baraj.SuYuksekligi} m
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Kullanılabilir Gölsü Hacmi:</span>{" "}
            {convertToHM3(baraj.KullanılabilirGolSuHacmi)} hm³
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Tüketilebilir Su Kapasitesi:</span>{" "}
            {convertToHM3(baraj.TuketilebilirSuKapasitesi)} hm³
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Maksimum Su Kapasitesi:</span>{" "}
            {convertToHM3(baraj.MaksimumSuKapasitesi)} hm³
          </p>
        </div>
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">Minimum Su Yüksekliği:</span>{" "}
            {baraj.MinimumSuYuksekligi} m
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Doluluk Oranı:</span>{" "}
            {baraj.DolulukOrani}%
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Durum Tarihi:</span>{" "}
            {new Date(baraj.DurumTarihi).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Minimum Su Kapasitesi:</span>{" "}
            {convertToHM3(baraj.MinimumSuKapasitesi)} hm³
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Maksimum Su Yüksekliği:</span>{" "}
            {baraj.MaksimumSuYuksekligi} m
          </p>
        </div>
      </div>
      <div className="flex justify-start items-end h-40 mt-4">
        <div className="relative w-full h-32 bg-gray-300 border-t-2 border-b-2 border-gray-700 overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 h-full bg-blue-500"
            style={{
              height: `${baraj.DolulukOrani}%`,
              animation:
                "wave 1.5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite alternate",
            }}
          ></div>
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={() => searchOnWikipedia(baraj.BarajKuyuAdi)}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Wikipedia'da Ara
        </button>
        <button
          onClick={readDetailsAloud}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Sesli Oku
        </button>
      </div>
    </div>
  );
};

const Baraj = () => {
  const [barajlar, setBarajlar] = useState([]);
  const [selectedBaraj, setSelectedBaraj] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarajlar = async () => {
      try {
        const response = await axios.get(
          "https://openapi.izmir.bel.tr/api/izsu/barajdurum"
        );
        setBarajlar(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBarajlar();
  }, []);

  const handleBarajClick = (baraj) => {
    setSelectedBaraj(baraj);
  };

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-xl font-semibold mb-4">
        İzmir Baraj Doluluk Oranları
      </h1>
      {error && <p className="text-red-500">Hata: {error}</p>}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 pr-0 md:pr-2">
          <h2 className="text-lg font-semibold mb-2">Barajlar</h2>
          <BarajListesi barajlar={barajlar} handleClick={handleBarajClick} />
        </div>
        <div className="w-full md:w-1/2 pr-5 pl-5 pl-0 md:pl-2">
          <h2 className="text-lg font-semibold mb-2">Seçili Baraj</h2>
          {selectedBaraj ? (
            <BarajDetay baraj={selectedBaraj} />
          ) : (
            <p className="text-gray-700">Lütfen bir baraj seçin.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Baraj;
