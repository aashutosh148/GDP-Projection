import React, { useState, useEffect, useCallback } from 'react';
import CountrySelector from './components/CountrySelector';
import GDPChart from './components/GDPChart';
import GrowthRateSlider from './components/GrowthRateSlider';
import { fetchGDPData } from './utils/api';
import Footer from './components/Footer';
import { getGDPProjectionWithSummary } from './utils/ai';

const data = {
    "Afghanistan": "AFG",
    "Albania": "ALB",
    "Algeria": "DZA",
    "American Samoa": "ASM",
    "Andorra": "AND",
    "Angola": "AGO",
    "Anguilla": "AIA",
    "Antigua and Barbuda": "ATG",
    "Argentina": "ARG",
    "Armenia": "ARM",
    "Aruba": "ABW",
    "Australia": "AUS",
    "Austria": "AUT",
    "Azerbaijan": "AZE",
    "Bahamas, The": "BHS",
    "Bahrain": "BHR",
    "Bangladesh": "BGD",
    "Barbados": "BRB",
    "Belarus": "BLR",
    "Belgium": "BEL",
    "Belize": "BLZ",
    "Benin": "BEN",
    "Bermuda": "BMU",
    "Bhutan": "BTN",
    "Bolivia": "BOL",
    "Bosnia and Herzegovina": "BIH",
    "Botswana": "BWA",
    "Brazil": "BRA",
    "Brunei Darussalam": "BRN",
    "Bulgaria": "BGR",
    "Burkina Faso": "BFA",
    "Burundi": "BDI",
    "Cabo Verde": "CPV",
    "Cambodia": "KHM",
    "Cameroon": "CMR",
    "Canada": "CAN",
    "Central African Republic": "CAF",
    "Chad": "TCD",
    "Chile": "CHL",
    "China": "CHN",
    "Colombia": "COL",
    "Comoros": "COM",
    "Dem. Rep. of Congo": "COD",
    "Republic of Congo": "COG",
    "Cook Islands": "COK",
    "Costa Rica": "CRI",
    "Croatia": "HRV",
    "Cuba": "CUB",
    "Cyprus": "CYP",
    "Czech Republic": "CZE",
    "Denmark": "DNK",
    "Djibouti": "DJI",
    "Dominica": "DMA",
    "Dominican Republic": "DOM",
    "Ecuador": "ECU",
    "Egypt": "EGY",
    "El Salvador": "SLV",
    "Equatorial Guinea": "GNQ",
    "Eritrea": "ERI",
    "Estonia": "EST",
    "Eswatini": "SWZ",
    "Ethiopia": "ETH",
    "Falkland Islands": "FLK",
    "Fiji": "FJI",
    "Finland": "FIN",
    "France": "FRA",
    "Gabon": "GAB",
    "Gambia, The": "GMB",
    "Georgia": "GEO",
    "Germany": "DEU",
    "Ghana": "GHA",
    "Gibraltar": "GIB",
    "Greece": "GRC",
    "Greenland": "GRL",
    "Grenada": "GRD",
    "Guadeloupe": "GLP",
    "Guam": "GUM",
    "Guatemala": "GTM",
    "Guinea": "GIN",
    "Guinea-Bissau": "GNB",
    "Guyana": "GUY",
    "Haiti": "HTI",
    "Honduras": "HND",
    "Hong Kong SAR": "HKG",
    "Hungary": "HUN",
    "Iceland": "ISL",
    "India": "IND",
    "Indonesia": "IDN",
    "Iran": "IRN",
    "Iraq": "IRQ",
    "Ireland": "IRL",
    "Israel": "ISR",
    "Italy": "ITA",
    "Jamaica": "JAM",
    "Japan": "JPN",
    "Jordan": "JOR",
    "Kazakhstan": "KAZ",
    "Kenya": "KEN",
    "Kiribati": "KIR",
    "Republic of Korea": "KOR",
    "Kuwait": "KWT",
    "Kyrgyz Republic": "KGZ",
    "Lao P.D.R.": "LAO",
    "Latvia": "LVA",
    "Lebanon": "LBN",
    "Lesotho": "LSO",
    "Liberia": "LBR",
    "Libya": "LBY",
    "Lithuania": "LTU",
    "Luxembourg": "LUX",
    "Madagascar": "MDG",
    "Malawi": "MWI",
    "Malaysia": "MYS",
    "Maldives": "MDV",
    "Mali": "MLI",
    "Malta": "MLT",
    "Marshall Islands": "MHL",
    "Mauritania": "MRT",
    "Mauritius": "MUS",
    "Mexico": "MEX",
    "Micronesia": "FSM",
    "Moldova": "MDA",
    "Monaco": "MCO",
    "Mongolia": "MNG",
    "Montenegro": "MNE",
    "Morocco": "MAR",
    "Mozambique": "MOZ",
    "Myanmar": "MMR",
    "Namibia": "NAM",
    "Nauru": "NRU",
    "Nepal": "NPL",
    "Netherlands": "NLD",
    "New Caledonia": "NCL",
    "New Zealand": "NZL",
    "Nicaragua": "NIC",
    "Niger": "NER",
    "Nigeria": "NGA",
    "North Macedonia": "MKD",
    "Norway": "NOR",
    "Oman": "OMN",
    "Pakistan": "PAK",
    "Palau": "PLW",
    "Panama": "PAN",
    "Papua New Guinea": "PNG",
    "Paraguay": "PRY",
    "Peru": "PER",
    "Philippines": "PHL",
    "Poland": "POL",
    "Portugal": "PRT",
    "Puerto Rico": "PRI",
    "Qatar": "QAT",
    "Romania": "ROU",
    "Russian Federation": "RUS",
    "Rwanda": "RWA",
    "Saint Kitts and Nevis": "KNA",
    "Saint Lucia": "LCA",
    "Saint Vincent and the Grenadines": "VCT",
    "Samoa": "WSM",
    "San Marino": "SMR",
    "Sao Tome and Principe": "STP",
    "Saudi Arabia": "SAU",
    "Senegal": "SEN",
    "Serbia": "SRB",
    "Seychelles": "SYC",
    "Sierra Leone": "SLE",
    "Singapore": "SGP",
    "Slovak Republic": "SVK",
    "Slovenia": "SVN",
    "Solomon Islands": "SLB",
    "Somalia": "SOM",
    "South Africa": "ZAF",
    "Republic of South Sudan": "SSD",
    "Spain": "ESP",
    "Sri Lanka": "LKA",
    "Sudan": "SDN",
    "Suriname": "SUR",
    "Sweden": "SWE",
    "Switzerland": "CHE",
    "Syria": "SYR",
    "Taiwan Province of China": "TWN",
    "Tajikistan": "TJK",
    "Tanzania": "TZA",
    "Thailand": "THA",
    "Timor-Leste": "TLS",
    "Togo": "TGO",
    "Tonga": "TON",
    "Trinidad and Tobago": "TTO",
    "Tunisia": "TUN",
    "Turkeye": "TUR",
    "Turkmenistan": "TKM",
    "Tuvalu": "TUV",
    "Uganda": "UGA",
    "Ukraine": "UKR",
    "United Arab Emirates": "ARE",
    "United Kingdom": "GBR",
    "United States": "USA",
    "Uruguay": "URY",
    "Uzbekistan": "UZB",
    "Vanuatu": "VUT",
    "Venezuela": "VEN",
    "Vietnam": "VNM",
    "Western Sahara": "ESH",
    "Yemen": "YEM",
    "Zambia": "ZMB",
    "Zimbabwe": "ZWE"
};


const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const App = () => {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [growthRates, setGrowthRates] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    // AI state
    const [aiProjections, setAiProjections] = useState({}); // { [countryCode]: [{year, gdp}] }
    const [aiMeta, setAiMeta] = useState({}); // { [countryCode]: { rationale, risks, recommendations } }

    const calculateGDP = useCallback(async (countryCode, initialGDP, growthRate) => {
        // Use explicit calendar years 2024-2050 to align with AI projections
        const years = Array.from({ length: 27 }, (_, i) => String(2024 + i));
        const gdpValues = [initialGDP];

        for (let i = 1; i < 27; i++) {
            const nextGDP = gdpValues[i - 1] * (1 + growthRate / 100);
            gdpValues.push(Math.round(nextGDP));
        }

        return { years, gdpValues };
    }, []);
    const getBestAvailableYear = (gdpData) => {
        const targetYear = 2024;
        const fallbackYear = 2020;
        const availableYears = Object.keys(gdpData).map(Number).sort((a, b) => b - a);
        let selectedYear = null;

        for (const year of availableYears) {
            if (year <= targetYear && year >= fallbackYear) {
                selectedYear = year;
                break;
            }
        }

        return selectedYear;
    };
    const updateChartData = useCallback(async () => {
        const newChartData = [];
        let years = Array.from({ length: 27 }, (_, i) => String(2024 + i));

        for (let i = 0; i < selectedCountries.length; i++) {
            const countryCode = selectedCountries[i];
            const countryName = Object.keys(data).find(key => data[key] === countryCode);
            const gdpData = await fetchGDPData(countryCode);

            if (gdpData) {
                const latestYear = getBestAvailableYear(gdpData);
                const initialGDP = gdpData[latestYear];
                const growthRate = growthRates[countryCode] || 5;

                const { gdpValues } = await calculateGDP(countryCode, initialGDP, growthRate);

                newChartData.push({
                    name: `${countryName} (baseline)`,
                    data: gdpValues,
                    color: colors[i % colors.length],
                });

                // Add AI series if available
                const ai = aiProjections[countryCode];
                if (Array.isArray(ai) && ai.length) {
                    const aiSeries = years.map(y => {
                        const item = ai.find(p => String(p.year) === y);
                        return item ? Math.round(item.gdp) : null;
                    });
                    newChartData.push({
                        name: `${countryName} (AI)`,
                        data: aiSeries,
                        color: colors[(i + 1) % colors.length],
                    });
                }
            }
        }

        setChartData(newChartData);
        setCategories(years);
    }, [selectedCountries, growthRates, calculateGDP, aiProjections]);

    useEffect(() => {
        updateChartData();
    }, [updateChartData]);

    const handleCountrySelect = async (countryCode) => {
        if (!selectedCountries.includes(countryCode)) {
            const countryName = Object.keys(data).find(key => data[key] === countryCode);
            setSelectedCountries(prev => [...prev, countryCode]);
            setGrowthRates(prev => ({ ...prev, [countryCode]: 5 }));

            // Kick off AI projection fetch with user-visible feedback
            setIsLoading(true);
            setStatusMsg(`Fetching IMF GDP and generating AI projection for ${countryName}...`);
            try {
                const gdpData = await fetchGDPData(countryCode);
                if (gdpData) {
                    const latestYear = getBestAvailableYear(gdpData);
                    const currentGDP = gdpData[latestYear];

                    const ai = await getGDPProjectionWithSummary({
                        countryName,
                        currentGDPUSD: currentGDP,
                    });

                    setAiProjections(prev => ({ ...prev, [countryCode]: ai.projections }));
                    setAiMeta(prev => ({
                        ...prev,
                        [countryCode]: {
                            rationale: ai.rationale,
                            risks: ai.risks,
                            recommendations: ai.recommendations,
                        }
                    }));
                }
            } catch (e) {
                console.error(e);
                setStatusMsg(`AI projection failed for ${countryName}. Showing baseline only.`);
                setTimeout(() => setStatusMsg(''), 3000);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGrowthRateChange = (countryCode, newRate) => {
        setGrowthRates(prev => ({ ...prev, [countryCode]: newRate }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <div className="min-h-screen bg-gray-900 p-8  ">
                    <h1 className="text-2xl text-white mb-4 m-auto text-center font-bold">GDP Projection 2024-2050</h1>
                    <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">

                        <CountrySelector
                            countries={data}
                            selectedCountries={selectedCountries}
                            onCountrySelect={handleCountrySelect}
                            loading={isLoading}
                        />

                        {statusMsg && (
                            <div className="mb-3 text-sm text-blue-200">{statusMsg}</div>
                        )}

                        {isLoading && (
                            <div className="mb-4 w-full h-2 bg-gray-700 rounded overflow-hidden">
                                <div className="h-2 bg-blue-500 animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                        )}

                        <GDPChart chartData={chartData} categories={categories} />

                        {selectedCountries.map(countryCode => (
                            <GrowthRateSlider
                                key={countryCode}
                                country={Object.keys(data).find(key => data[key] === countryCode)}
                                growthRate={growthRates[countryCode] || 5}
                                onChange={(newRate) => handleGrowthRateChange(countryCode, newRate)}
                            />
                        ))}

                        {/* AI Summary Section */}
                        {selectedCountries.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">AI Summary</h2>
                                {selectedCountries.map(code => {
                                    const countryName = Object.keys(data).find(key => data[key] === code);
                                    const meta = aiMeta[code];
                                    return (
                                        <div key={code} className="bg-gray-900 rounded p-4 border border-gray-700">
                                            <h3 className="text-white font-medium mb-2">{countryName}</h3>
                                            {meta ? (
                                                <div className="text-gray-200 text-sm space-y-2">
                                                    <div>
                                                        <span className="font-semibold">Rationale: </span>{meta.rationale || '—'}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">Risks: </span>{meta.risks || '—'}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold">How to attain growth: </span>{meta.recommendations || '—'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 text-sm">Generating AI summary...</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            < Footer ></Footer>
        </div>
    );
};

export default App;