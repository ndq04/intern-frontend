import { Link } from "react-router-dom";
import { formatDate } from "../utils/common";
const HeadingResult = ({ data }) => {
  const amounts = data && data.map(item => item.KINGAKU);
  const moneys = amounts && amounts.reduce((a, b) => a + b, 0);
  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading pb-3">
          <h3 className="header-title">
            <strong>検索結果</strong>
          </h3>
        </div>
        {data && data.length > 0 ? (
          <div className="panel-body">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">行</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">伝票番号</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">起票部門</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">伝票日付</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">申請日</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">出納方法</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">出張目的</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">金額</span></th>
                  <th className="is-center"><span className="mb0 nowrap ct-custom bbw">行選択</span></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span>{index + 1}</span>
                    </td>
                    <td>
                      <Link to={{ pathname: '/scheduled', hash: `${item.DENPYONO}` }} state={{ item }}>{item.DENPYONO}</Link>
                    </td>
                    <td>
                      <span>{item.BUMONNM}</span>
                    </td>
                    <td>
                      <span>{formatDate(item.DENPYODT)}</span>
                    </td>
                    <td>
                      <span>{formatDate(item.UKETUKEDT)}</span>
                    </td>
                    <td>
                      <span>{item.SUITOKB}</span>
                    </td>
                    <td>
                      <span>{item.BIKO}</span>
                    </td>
                    <td>
                      <span>{item.KINGAKU}</span>
                    </td>
                    <td>
                      <span><input type="checkbox" name="" id="" /></span>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>交通費計</td>
                  <td>{moneys}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div>検索結果がありません。</div>
        )}
      </div>
    </div>
  )
}

export default HeadingResult