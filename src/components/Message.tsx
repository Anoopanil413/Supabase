import { Card, Row, Col, Tooltip } from 'antd';
import { MdVerified } from 'react-icons/md';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { truncateText } from '../utils/index';
dayjs.extend(relativeTime);

export default function Message({ message, isYou }:any) {
  // const countyCode =
  //   message.country && message.country !== 'undefined'
  //     ? message.country.toLowerCase()
  //     : '';

  return (
    <div style={{ display: 'flex', justifyContent: isYou ? 'flex-end' : 'flex-start' }}>
      <Card
        style={{
          width: '70%',
          padding: '12px',
          borderRadius: '5px',
          borderTopLeftRadius: isYou ? '5px' : '0',
          borderTopRightRadius: isYou ? '0' : '5px',
          backgroundColor: isYou ? '#dbfff9' : '#edf3f9',
          marginTop: '20px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            content: "''",
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: isYou ? '0 0 10px 10px' : '0 10px 10px 0',
            borderColor: isYou
              ? 'transparent transparent transparent #dbfff9'
              : 'transparent #edf3f9 transparent transparent',
            top: 0,
            left: isYou ? 'auto' : '-10px',
            right: isYou ? '-10px' : 'auto',
          }}
        />
        <Row>
          <Col span={24}>
            <div style={{ fontWeight: 500, fontSize: '14px', color: 'gray', marginBottom: '8px' }}>
              <span>{message.username} </span>
              {message.is_authenticated && (
                <Tooltip title="Verified">
                  <MdVerified color="#1d9bf0" style={{ display: 'inline', marginRight: '5px' }} />
                </Tooltip>
              )}
              {/* {countyCode && (
                <span style={{ fontSize: '10px' }}>
                  from {message.country}{' '}
                  <img
                    style={{ display: 'inline-block', marginTop: '-4px' }}
                    src={`/flags/${countyCode}.png`}
                    alt={message.country}
                  />
                </span>
              )} */}
            </div>
          </Col>
          <Col span={24}>
            <div
              style={{
                textAlign: 'left',
                wordBreak: 'break-word',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {truncateText(message.text)}
            </div>
          </Col>
          <Col span={24}>
            <div style={{ color: 'gray', fontSize: '10px', textAlign: 'right' }}>
              {/* {dayjs(message.timestamp).fromNow()} */}days
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
