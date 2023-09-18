import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { convertTimeZone } from '@/utils/useConvertTimeZone'

const EXCEL_TYPE = 'application/octet-stream;charset=utf-8"'
const EXCEL_EXTENSION = '.xlsx'

export const exportTableToExcel = (tableList, name = '報表') => {
  const xlsxParam = { raw: true } // 轉換成excel時，使用原始的格式，這樣導出的時候數字過長不會變成科學計數法
  const workbook = XLSX.utils.book_new()

  tableList.forEach((item) => {
    const sheet = XLSX.utils.table_to_sheet(item, xlsxParam)
    XLSX.utils.book_append_sheet(workbook, sheet, item.getAttribute('data-name'))
  })
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: EXCEL_TYPE
      }),
      `${name}${EXCEL_EXTENSION}`
    )
  } catch (e) {
    console.log(e)
  }
  return wbout
}

export const exportJsonToExcel = (data, name = '玩家資訊') => {
  const workSheet = XLSX.utils.json_to_sheet(data)
  const workBook = {
    Sheets: {
      [name]: workSheet
    },
    SheetNames: [name]
  }

  const excelBuffer = XLSX.write(workBook, {
    bookType: 'xlsx',
    type: 'array'
  })

  const saveAsExcel = (buffer, fileName) => {
    const data = new Blob([buffer], { type: EXCEL_TYPE })

    FileSaver.saveAs(data, `${fileName}.${EXCEL_EXTENSION}`)
  }

  // yyyymmdd hhmmss(匯出時間)_玩家資訊
  const now = new Date().toString()
  const { year, month, date, hours, minutes, seconds } = convertTimeZone(now, -3)
  const exportName = `${year}${month}${date} ${hours}${minutes}${seconds}_${name}`

  saveAsExcel(excelBuffer, exportName)

  return excelBuffer
}
