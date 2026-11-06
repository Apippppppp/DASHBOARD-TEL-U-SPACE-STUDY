// Data mock mahasiswa (dummy).
export const ADMIN_STUDENTS = [
  { id: 's1', nim: '1202230001', name: 'Aditya Pratama', email: 'aditya.pratama@student.telkomuniversity.ac.id', prodi: 'Informatika' },
  { id: 's2', nim: '1202230002', name: 'Bintang Ramadhan', email: 'bintang.ramadhan@student.telkomuniversity.ac.id', prodi: 'Rekayasa Perangkat Lunak' },
  { id: 's3', nim: '1202230003', name: 'Citra Ayu Lestari', email: 'citra.ayu@student.telkomuniversity.ac.id', prodi: 'Sistem Informasi' },
  { id: 's4', nim: '1202230004', name: 'Dewangga Saputra', email: 'dewangga.s@student.telkomuniversity.ac.id', prodi: 'Informatika' },
  { id: 's5', nim: '1202230005', name: 'Eka Nur Fadilah', email: 'eka.nur@student.telkomuniversity.ac.id', prodi: 'Data Science' },
  { id: 's6', nim: '1202230006', name: 'Fajar Nugroho', email: 'fajar.nugroho@student.telkomuniversity.ac.id', prodi: 'Rekayasa Perangkat Lunak' },
  { id: 's7', nim: '1202230007', name: 'Gita Puspita Sari', email: 'gita.puspita@student.telkomuniversity.ac.id', prodi: 'Sistem Informasi' },
  { id: 's8', nim: '1202230008', name: 'Hanif Rizky', email: 'hanif.rizky@student.telkomuniversity.ac.id', prodi: 'Informatika' },
  { id: 's9', nim: '1202230009', name: 'Intan Maharani', email: 'intan.maharani@student.telkomuniversity.ac.id', prodi: 'Teknologi Informasi' },
  { id: 's10', nim: '1202230010', name: 'Joko Susilo', email: 'joko.susilo@student.telkomuniversity.ac.id', prodi: 'Informatika' },
  { id: 's11', nim: '1202230011', name: 'Kirana Wulandari', email: 'kirana.w@student.telkomuniversity.ac.id', prodi: 'Rekayasa Perangkat Lunak' },
  { id: 's12', nim: '1202230012', name: 'Lukman Hakim', email: 'lukman.hakim@student.telkomuniversity.ac.id', prodi: 'Data Science' },
  { id: 's13', nim: '1202230013', name: 'Maya Anggraini', email: 'maya.anggraini@student.telkomuniversity.ac.id', prodi: 'Sistem Informasi' },
  { id: 's14', nim: '1202230014', name: 'Naufal Akbar', email: 'naufal.akbar@student.telkomuniversity.ac.id', prodi: 'Teknologi Informasi' }
]

export const getStudentById = (id) => ADMIN_STUDENTS.find((s) => s.id === id)
