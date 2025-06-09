export interface Ward {
  id: string;
  name: string;
  district_id: string;
}

export interface District {
  id: string;
  name: string;
  region_id: string;
  wards: Ward[];
}

export interface Region {
  id: string;
  name: string;
  districts: District[];
}

export const regions: Region[] = [
  {
    id: '1',
    name: 'Arusha',
    districts: [
      {
        id: '101',
        name: 'Arusha City',
        region_id: '1',
        wards: [
          { id: '10101', name: 'Daraja Mbili', district_id: '101' },
          { id: '10102', name: 'Elerai', district_id: '101' },
          { id: '10103', name: 'Engutoto', district_id: '101' },
          { id: '10104', name: 'Kaloleni', district_id: '101' },
          { id: '10105', name: 'Kimandolu', district_id: '101' },
          { id: '10106', name: 'Lemara', district_id: '101' },
          { id: '10107', name: 'Levolosi', district_id: '101' },
          { id: '10108', name: 'Monduli Juu', district_id: '101' },
          { id: '10109', name: 'Ngarenaro', district_id: '101' },
          { id: '10110', name: 'Oloirien', district_id: '101' },
          { id: '10111', name: 'Sekei', district_id: '101' },
          { id: '10112', name: 'Sombetini', district_id: '101' },
          { id: '10113', name: 'Terrat', district_id: '101' },
          { id: '10114', name: 'Themi', district_id: '101' },
          { id: '10115', name: 'Unga Limited', district_id: '101' }
        ]
      },
      {
        id: '102',
        name: 'Arusha District',
        region_id: '1',
        wards: [
          { id: '10201', name: 'Bwawani', district_id: '102' },
          { id: '10202', name: 'Ilkiding\'a', district_id: '102' },
          { id: '10203', name: 'Kiranyi', district_id: '102' },
          { id: '10204', name: 'Kisongo', district_id: '102' },
          { id: '10205', name: 'Mlangarini', district_id: '102' },
          { id: '10206', name: 'Moshono', district_id: '102' },
          { id: '10207', name: 'Mundarara', district_id: '102' },
          { id: '10208', name: 'Ngaramtoni', district_id: '102' },
          { id: '10209', name: 'Olturoto', district_id: '102' },
          { id: '10210', name: 'Oloirien', district_id: '102' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Dar es Salaam',
    districts: [
      {
        id: '201',
        name: 'Ilala',
        region_id: '2',
        wards: [
          { id: '20101', name: 'Buguruni', district_id: '201' },
          { id: '20102', name: 'Chanika', district_id: '201' },
          { id: '20103', name: 'Gerezani', district_id: '201' },
          { id: '20104', name: 'Ilala', district_id: '201' },
          { id: '20105', name: 'Kariakoo', district_id: '201' },
          { id: '20106', name: 'Kisutu', district_id: '201' },
          { id: '20107', name: 'Kivukoni', district_id: '201' },
          { id: '20108', name: 'Kisarawe II', district_id: '201' },
          { id: '20109', name: 'Mchafukoge', district_id: '201' },
          { id: '20110', name: 'Msongola', district_id: '201' },
          { id: '20111', name: 'Pugu', district_id: '201' },
          { id: '20112', name: 'Segerea', district_id: '201' },
          { id: '20113', name: 'Tabata', district_id: '201' },
          { id: '20114', name: 'Ukonga', district_id: '201' },
          { id: '20115', name: 'Vingunguti', district_id: '201' },
          { id: '20116', name: 'Yombo Vituka', district_id: '201' }
        ]
      },
      {
        id: '202',
        name: 'Kinondoni',
        region_id: '2',
        wards: [
          { id: '20201', name: 'Bunju', district_id: '202' },
          { id: '20202', name: 'Goba', district_id: '202' },
          { id: '20203', name: 'Kawe', district_id: '202' },
          { id: '20204', name: 'Kibamba', district_id: '202' },
          { id: '20205', name: 'Kigogo', district_id: '202' },
          { id: '20206', name: 'Kijitonyama', district_id: '202' },
          { id: '20207', name: 'Kinondoni', district_id: '202' },
          { id: '20208', name: 'Kunduchi', district_id: '202' },
          { id: '20209', name: 'Makuburi', district_id: '202' },
          { id: '20210', name: 'Makumbusho', district_id: '202' },
          { id: '20211', name: 'Mbezi', district_id: '202' },
          { id: '20212', name: 'Mburahati', district_id: '202' },
          { id: '20213', name: 'Mikocheni', district_id: '202' },
          { id: '20214', name: 'Msasani', district_id: '202' },
          { id: '20215', name: 'Mwananyamala', district_id: '202' },
          { id: '20216', name: 'Ndugumbi', district_id: '202' },
          { id: '20217', name: 'Tandale', district_id: '202' },
          { id: '20218', name: 'Ubungo', district_id: '202' },
          { id: '20219', name: 'Wazo', district_id: '202' }
        ]
      },
      {
        id: '203',
        name: 'Temeke',
        region_id: '2',
        wards: [
          { id: '20301', name: 'Azimio', district_id: '203' },
          { id: '20302', name: 'Chamazi', district_id: '203' },
          { id: '20303', name: 'Charambe', district_id: '203' },
          { id: '20304', name: 'Keko', district_id: '203' },
          { id: '20305', name: 'Kibada', district_id: '203' },
          { id: '20306', name: 'Kigamboni', district_id: '203' },
          { id: '20307', name: 'Kijichi', district_id: '203' },
          { id: '20308', name: 'Kisarawe', district_id: '203' },
          { id: '20309', name: 'Kurasini', district_id: '203' },
          { id: '20310', name: 'Mbagala', district_id: '203' },
          { id: '20311', name: 'Miburani', district_id: '203' },
          { id: '20312', name: 'Mjimwema', district_id: '203' },
          { id: '20313', name: 'Mtoni', district_id: '203' },
          { id: '20314', name: 'Pemba Mnazi', district_id: '203' },
          { id: '20315', name: 'Sandali', district_id: '203' },
          { id: '20316', name: 'Somangila', district_id: '203' },
          { id: '20317', name: 'Tandika', district_id: '203' },
          { id: '20318', name: 'Temeke', district_id: '203' },
          { id: '20319', name: 'Toangoma', district_id: '203' },
          { id: '20320', name: 'Tungi', district_id: '203' },
          { id: '20321', name: 'Yombo Vituka', district_id: '203' }
        ]
      }
    ]
  }
];

export const getDistrictsByRegion = (regionId: string): District[] => {
  const region = regions.find(r => r.id === regionId);
  return region ? region.districts : [];
};

export const getWardsByDistrict = (districtId: string): Ward[] => {
  for (const region of regions) {
    const district = region.districts.find(d => d.id === districtId);
    if (district) {
      return district.wards;
    }
  }
  return [];
}; 